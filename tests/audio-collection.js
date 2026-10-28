import scenes from '../scenes.js';
import {Soundscape} from '../soundscape.js';
const $=id=>document.getElementById(id);
const summary={duration:scenes.length*6,secondsPerScene:6,sampleRate:32000,channels:2,pcmBits:16,volume:.38,normalized:false,heard:false,scenes:scenes.map((s,i)=>({start:i*6,end:(i+1)*6,id:s.id,title:s.title,style:s.style}))};
$('report').textContent=JSON.stringify(summary,null,2);
function encode(buffer){
 const n=buffer.length,sr=buffer.sampleRate,channels=[buffer.getChannelData(0),buffer.getChannelData(1)];
 const data=new ArrayBuffer(44+n*4),view=new DataView(data);
 const str=(o,s)=>{for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i))};
 str(0,'RIFF');view.setUint32(4,36+n*4,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,sr,true);view.setUint32(28,sr*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,n*4,true);
 let peak=0,squares=0,clipped=0;
 const segments=summary.scenes.map(s=>({...s,peak:0,squares:0,samples:0}));
 for(let i=0;i<n;i++)for(let c=0;c<2;c++){
  const sample=channels[c][i],part=segments[Math.min(segments.length-1,Math.floor(i/sr/6))];
  if(!Number.isFinite(sample))throw Error(`Non-finite sample at ${i}`);
  peak=Math.max(peak,Math.abs(sample));squares+=sample*sample;part.peak=Math.max(part.peak,Math.abs(sample));part.squares+=sample*sample;part.samples++;
  if(Math.abs(sample)>=1)clipped++;
  view.setInt16(44+(i*2+c)*2,Math.round(sample*32767),true);
 }
 if(clipped)throw Error(`Output contains ${clipped} clipped samples; file not generated.`);
 summary.peak=peak;summary.peakDbFS=20*Math.log10(peak);summary.rms=Math.sqrt(squares/(n*2));summary.clippedSamples=clipped;
 summary.segments=segments.map(({squares,samples,...s})=>({...s,rms:Math.sqrt(squares/samples)}));
 return new Blob([data],{type:'audio/wav'});
}
$('generate').onclick=async()=>{
 $('generate').disabled=true;$('status').textContent='正在初始化真实 Web Audio 合成图…';
 let engine;
 try{
  const ctx=new OfflineAudioContext(2,summary.sampleRate*summary.duration,summary.sampleRate);
  engine=new Soundscape({volume:summary.volume});engine.context=ctx;
  await engine._build();clearInterval(engine._eventTimer);engine.enabled=true;
  // The offline output is deliberately independent of foreground-tab visibility.
  // This changes only the master scheduling, not the synthesis graph or its timbre.
  engine.setScene(scenes[0]);engine.master.gain.setTargetAtTime(summary.volume*.85,0,.7);
  const pending=[];
  for(let t=.25;t<summary.duration-.1;t+=.25){
   const at=t;
   pending.push(ctx.suspend(at).then(()=>{
    const index=Math.floor(at/6),scene=scenes[index];
    if(at%6===0){engine.setScene(scene);$('status').textContent=`正在合成 ${index+1}/${scenes.length}：${scene.title}`;}
    const local=at%6,gust=.55+.22*Math.sin(local*.37)+.13*Math.sin(local*.91+.6)+.10*Math.sin(local*.13+1.2);
    engine.update({time:local,wind:1,water:1,cloud:1,gust,playing:true});
    // A few deterministic event times expose the actual style's transient voice.
    if(engine.profile.drops>0&&(local===2||local===4.25))engine._event(engine.profile.colour);
    if(at===summary.duration-1.25)engine.master.gain.setTargetAtTime(0,ctx.currentTime,.22);
    return ctx.resume();
   }));
  }
  summary.renderStarted=new Date().toISOString();
  const buffer=await ctx.startRendering();await Promise.all(pending);
  const blob=encode(buffer);summary.bytes=blob.size;summary.noiseMode=engine.noiseMode;summary.renderFinished=new Date().toISOString();
  const url=URL.createObjectURL(blob);$('download').href=url;$('download').download='audio-collection-audition.wav';$('download').hidden=false;$('player').src=url;$('player').hidden=false;
  $('status').textContent=`生成完成 · ${summary.duration} 秒 · 峰值 ${summary.peakDbFS.toFixed(2)} dBFS · 削波 ${summary.clippedSamples} · 未试听`;
  $('report').textContent=JSON.stringify(summary,null,2);
 }catch(error){console.error(error);$('status').textContent=`生成失败：${error.message}`;$('report').textContent=String(error.stack||error);throw error;}
 finally{if(engine){clearInterval(engine._eventTimer);document.removeEventListener('visibilitychange',engine._onVisibility);engine.destroyed=true;for(const source of engine.sources){try{source.stop()}catch{}}for(const node of engine.nodes)node.disconnect();}}
};
