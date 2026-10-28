import scenes from '../scenes.js';
import {createWallpaperEngine} from '../engine.js';
import {Soundscape} from '../soundscape.js';
const imageScenes=scenes.filter(scene=>scene.kind!=='embedded');
const excludedScenes=scenes.filter(scene=>!imageScenes.includes(scene)).map(({id,kind})=>({id,kind,reason:'Independent embedded experience; separate UI/3D acceptance required.'}));
const $=id=>document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report={started:null,finished:null,environment:{userAgent:navigator.userAgent,devicePixelRatio,viewport:[innerWidth,innerHeight],reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches},scope:{totalScenes:scenes.length,imageSceneCount:imageScenes.length,excludedScenes},errors:[],scenes:[],checks:[],resources:{}};
function publish(){ $('report').textContent=JSON.stringify(report,null,2); }
function check(name,ok,details){report.checks.push({name,ok:!!ok,details});if(!ok)console.error(`QA assertion failed: ${name}`,details);publish();}
addEventListener('error',e=>{report.errors.push({type:'error',message:e.message,source:e.filename,line:e.lineno});publish()});
addEventListener('unhandledrejection',e=>{report.errors.push({type:'unhandledrejection',message:String(e.reason?.stack||e.reason)});publish()});
const originalError=console.error.bind(console); console.error=(...args)=>{report.errors.push({type:'console.error',message:args.map(x=>x?.stack||String(x)).join(' ')});originalError(...args);publish();};
const liveResources={textures:new Set(),shaders:new Set(),programs:new Set(),buffers:new Set()};
for(const [type,singular] of [['textures','Texture'],['shaders','Shader'],['programs','Program'],['buffers','Buffer']]){
 const proto=WebGLRenderingContext.prototype,create=proto['create'+singular],del=proto['delete'+singular];
 proto['create'+singular]=function(...args){const item=create.apply(this,args);if(item)liveResources[type].add(item);return item};
 proto['delete'+singular]=function(item){liveResources[type].delete(item);return del.call(this,item)};
}
const counts=()=>Object.fromEntries(Object.entries(liveResources).map(([k,v])=>[k,v.size]));
const originalRAF=requestAnimationFrame.bind(window),originalCancel=cancelAnimationFrame.bind(window),liveRAF=new Set();
window.requestAnimationFrame=callback=>{let id=originalRAF(time=>{liveRAF.delete(id);callback(time)});liveRAF.add(id);return id};
window.cancelAnimationFrame=id=>{liveRAF.delete(id);originalCancel(id)};
async function decode(src){const image=new Image();image.src=src;await image.decode();return {src,width:image.naturalWidth,height:image.naturalHeight,complete:image.complete};}
$('start').textContent=`开始 ${imageScenes.length} 幅图片场景技术自检`;
$('start').onclick=async()=>{
 $('start').disabled=true;report.started=new Date().toISOString();publish();
 const audio=new Soundscape({volume:0});let engine;
 try{
  await audio.enable();check('audio enabled silently',audio.enabled&&audio.context.state==='running',{noiseMode:audio.noiseMode,state:audio.context.state});
  for(const [index,scene] of imageScenes.entries()){
   $('status').textContent=`${index+1}/${imageScenes.length} ${scene.title}`;
   let callbacks=0,lastFrame;
   const entry={id:scene.id,title:scene.title,style:scene.style};report.scenes.push(entry);
   try{
    entry.image=await decode(scene.image);entry.foreground=await Promise.all((scene.foreground||[]).map(f=>decode(f.image)));
    audio.setScene(scene);
    engine=await createWallpaperEngine($('canvas'),scene,{quality:'fixed',maxDpr:1,maxResolution:1920,onError:error=>{throw error},onFrame:frame=>{callbacks++;lastFrame=frame;audio.update(frame)}});
    await sleep(2250);entry.metrics=engine.getMetrics();entry.audioFrame=lastFrame;
    check(`${scene.id}: decoded and rendered`,entry.image.width>0&&entry.metrics.backend==='webgl'&&entry.metrics.renderedFrames>1,entry.metrics);
    check(`${scene.id}: audio sync`,lastFrame&&lastFrame.sceneId===scene.id&&audio.motion.time===lastFrame.time&&audio.motion.gust===lastFrame.gust&&audio.motion.wind===lastFrame.wind&&audio.motion.playing===lastFrame.playing&&audio.motion.speed===lastFrame.speed&&audio.motion.waterTime===lastFrame.waterTime&&audio.motion.windTime===lastFrame.windTime&&audio.motion.cloudTime===lastFrame.cloudTime,{frame:lastFrame,motion:{...audio.motion}});
    entry.intensityResponse=[];
    for(const level of [0,1,3]){
      engine.setSettings({wind:level,water:level,cloud:level,light:level});await sleep(220);
      const sample={level,frame:{...lastFrame},audioMotion:{...audio.motion}};entry.intensityResponse.push(sample);
      check(`${scene.id}: intensity ${level} propagated`,['wind','water','cloud'].every(key=>lastFrame[key]===level&&audio.motion[key]===level),sample);
      if(level===0){const frozen={windTime:lastFrame.windTime,waterTime:lastFrame.waterTime,cloudTime:lastFrame.cloudTime};await sleep(160);check(`${scene.id}: zero intensity freezes layer clocks`,Object.entries(frozen).every(([key,value])=>Number.isFinite(value)&&lastFrame[key]===value),{before:frozen,after:{windTime:lastFrame.windTime,waterTime:lastFrame.waterTime,cloudTime:lastFrame.cloudTime}});}
    }
    engine.setSettings({wind:1,water:1,cloud:1,light:1});
    engine.setPlaying(false);await sleep(160);const frozen=engine.getMetrics().renderedFrames;await sleep(260);entry.paused={before:frozen,after:engine.getMetrics().renderedFrames,playing:engine.getMetrics().playing,audioPlaying:audio.motion.playing,raf:liveRAF.size};
    check(`${scene.id}: pause stops frames`,entry.paused.before===entry.paused.after&&!entry.paused.playing&&!entry.paused.audioPlaying&&entry.paused.raf===0,entry.paused);
    const blob=await engine.snapshot({width:3840,height:2160,type:'image/png'});const bitmap=await createImageBitmap(blob);entry.snapshot={type:blob.type,bytes:blob.size,width:bitmap.width,height:bitmap.height};bitmap.close();
    check(`${scene.id}: PNG export`,blob.type==='image/png'&&entry.snapshot.width===3840&&entry.snapshot.height===2160,entry.snapshot);
    engine.setPlaying(true);await sleep(170);entry.resumed=engine.getMetrics();check(`${scene.id}: resumes`,entry.resumed.playing&&entry.resumed.renderedFrames>entry.paused.after,entry.resumed);
    const beforeDestroyCallbacks=callbacks;engine.destroy();const framesAfterDestroy=engine.getMetrics().renderedFrames;await sleep(160);
    entry.destroy={resourceCounts:counts(),raf:liveRAF.size,overlayCount:document.querySelectorAll('.wallpaper-atmosphere').length,callbacksBefore:beforeDestroyCallbacks,callbacksAfter:callbacks,framesBefore:framesAfterDestroy,framesAfter:engine.getMetrics().renderedFrames,metricsActiveRaf:engine.getMetrics().activeRaf};
    check(`${scene.id}: destroy releases resources`,Object.values(entry.destroy.resourceCounts).every(n=>n===0)&&entry.destroy.raf===0&&entry.destroy.overlayCount===0&&entry.destroy.callbacksBefore===entry.destroy.callbacksAfter,entry.destroy);
    engine=null;entry.ok=!report.checks.filter(c=>c.name.startsWith(scene.id)).some(c=>!c.ok);
   }catch(error){entry.ok=false;entry.error=String(error.stack||error);console.error(error);engine?.destroy();engine=null;}
   const tr=document.createElement('tr');for(const value of [scene.title,entry.ok?'PASS':'FAIL',entry.metrics?.fps,`${entry.image?.width} × ${entry.image?.height}`,`${entry.snapshot?.width} × ${entry.snapshot?.height}`]){const td=document.createElement('td');td.textContent=String(value);tr.append(td)}$('rows').append(tr);publish();
  }
  let finalFrame;
  engine=await createWallpaperEngine($('canvas'),imageScenes[0],{quality:'fixed',maxDpr:1,onFrame:f=>{finalFrame=f;audio.update(f)},onError:e=>{throw e}});
  const burst=[imageScenes.at(-1),imageScenes[1],imageScenes[10],imageScenes[3],imageScenes[7]].filter(Boolean);
  await Promise.all(burst.map(scene=>engine.setScene(scene)));await sleep(200);
  report.rapidSwitch={requested:burst.map(s=>s.id),metrics:engine.getMetrics(),lastFrame:finalFrame};check('rapid setScene resolves latest request',engine.getMetrics().sceneId===burst.at(-1).id&&finalFrame.sceneId===burst.at(-1).id,report.rapidSwitch);
  report.speedResponse=[];
  for(const speed of [.25,1,3]){
    engine.setSettings({speed,wind:1,water:1,cloud:1});await sleep(160);
    const startFrame={...finalFrame},startWall=performance.now();await sleep(650);
    const finishFrame={...finalFrame},elapsed=(performance.now()-startWall)/1000;
    const sample={speed,elapsed,startFrame,finishFrame,sceneElapsed:finishFrame.time-startFrame.time,ratio:(finishFrame.time-startFrame.time)/elapsed};report.speedResponse.push(sample);
    check(`speed ${speed}: single clock scaling`,finishFrame.speed===speed&&Math.abs(finishFrame.delta-finishFrame.wallDelta*speed)<1e-6&&sample.ratio>speed*.65&&sample.ratio<speed*1.35&&audio.motion.time===finishFrame.time&&audio.motion.speed===speed,sample);
  }
  engine.setPlaying(false);await sleep(160);const audioPaused={...audio.motion};await sleep(180);check('accelerated pause preserves audio clock',audio.motion.time===audioPaused.time&&!audio.motion.playing,{before:audioPaused,after:{...audio.motion}});
  engine.setPlaying(true);await sleep(180);check('accelerated resume follows shared time',audio.motion.playing&&audio.motion.time>audioPaused.time,{before:audioPaused,after:{...audio.motion}});
  engine.destroy();engine=null;
  // Test-only deterministic preference stub; this does not change OS/browser settings.
  const realMatchMedia=window.matchMedia,preferenceEvents=new EventTarget();
  const preference={matches:true,media:'(prefers-reduced-motion: reduce)',addEventListener:(...args)=>preferenceEvents.addEventListener(...args),removeEventListener:(...args)=>preferenceEvents.removeEventListener(...args)};
  let reducedFrame;
  try{
    window.matchMedia=query=>query==='(prefers-reduced-motion: reduce)'?preference:realMatchMedia.call(window,query);
    engine=await createWallpaperEngine($('canvas'),imageScenes[0],{quality:'fixed',maxDpr:1,onFrame:frame=>{reducedFrame=frame;audio.update(frame)},onError:error=>{throw error}});
  }finally{window.matchMedia=realMatchMedia;}
  await sleep(180);const reducedInitial=engine.getMetrics();
  check('simulated reduced-motion initially pauses',reducedInitial.reducedMotion&&!reducedInitial.playing&&!audio.motion.playing,{metrics:reducedInitial,frame:reducedFrame});
  engine.setPlaying(true);await sleep(160);const reducedOrdinary=engine.getMetrics();
  check('ordinary play respects simulated reduced-motion',!reducedOrdinary.playing&&!reducedOrdinary.reducedMotionOverridden,{metrics:reducedOrdinary});
  engine.setPlaying(true,{userInitiated:true});await sleep(250);const reducedResumed=engine.getMetrics();
  report.reducedMotionSimulation={method:'test-only matchMedia stub; not OS preference emulation',before:reducedInitial,ordinaryPlay:reducedOrdinary,after:reducedResumed};
  check('explicit resume overrides simulated reduced-motion',reducedResumed.reducedMotion&&reducedResumed.reducedMotionOverridden&&reducedResumed.playing&&audio.motion.playing&&reducedResumed.renderedFrames>reducedInitial.renderedFrames,report.reducedMotionSimulation);
  engine.destroy();engine=null;audio.disable();await audio.destroy();
  report.resources={...counts(),raf:liveRAF.size,audioState:audio.context.state,overlayCount:document.querySelectorAll('.wallpaper-atmosphere').length};
  check('final resource release',Object.values(counts()).every(n=>n===0)&&liveRAF.size===0&&audio.context.state==='closed'&&report.resources.overlayCount===0,report.resources);
 }catch(error){console.error(error);report.fatal=String(error.stack||error);engine?.destroy();await audio.destroy();}
 report.finished=new Date().toISOString();report.pass=imageScenes.length>0&&report.scenes.length===imageScenes.length&&report.scenes.every(s=>s.ok)&&report.checks.every(c=>c.ok)&&report.errors.length===0;
 $('status').textContent=`完成：${report.pass?'PASS':'FAIL'}，${report.scenes.length} 幅，${report.checks.length} 项，${report.errors.length} 个错误`;publish();
 const output=$('download-report');output.href=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));output.download='motion-qa-raw.json';output.hidden=false;
};
