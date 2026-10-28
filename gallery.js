import './gallery.css';
import scenes from './scenes.js';
import { createWallpaperEngine } from './engine.js';
import { Soundscape } from './soundscape.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const sceneList = Array.isArray(scenes) ? scenes : [];
const savedFavorites=readStorage('stillscape-favorites', []);
const favorites = new Set(Array.isArray(savedFavorites)?savedFavorites:[]);
let category = new URL(location.href).searchParams.get('collection')==='new'?'最新作品':'全部作品', query = '', favoritesOnly = false, currentIndex = -1;
let engine = null, sound = null, soundOn = false, playing = true, immersive = false;
let openToken = 0, toastTimer, originFocus, galleryScroll = 0;
let contrastPixels=null, contrastWidth=0, contrastHeight=0, contrastImage=null, contrastResizeTimer;
const settings = {wind:1,water:1,cloud:1,light:1,speed:1,power:1,volume:.3};
const reducedMotionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let motionOverride=false, actualMotionState='loading', motionStatusKey='', motionLoadFailed=false, embeddedFrame=null, embeddedLoadTimer;
let embeddedReady=false, embeddedCapabilities={}, snapshotRequest=null, snapshotSequence=0;
// Keep visible controls aligned with the implemented per-scene motion groups.
const sceneMotionControls = {
  "00": {
    "controls": {
      "wind": "柏树风摆",
      "water": "湖面波纹",
      "cloud": "云层流动"
    },
    "hint": "柏树随风摇摆、湖面反光起伏与云层流动。"
  },
  "01": {
    "controls": {
      "water": "海湾金纹",
      "cloud": "旋涡云流",
      "light": "星点明暗"
    },
    "hint": "旋涡笔触缓转、海湾金纹推进与星点明暗变化。"
  },
  "02": {
    "controls": {
      "water": "瀑流与小舟",
      "cloud": "山间薄雾"
    },
    "hint": "瀑布细流、小舟与倒影起伏，以及山间低雾横移。"
  },
  "03": {
    "controls": {
      "wind": "松枝摇摆",
      "water": "潮纹推进",
      "cloud": "低云横移"
    },
    "hint": "松枝随风摇摆、宽潮纹推进与低云横移。"
  },
  "04": {
    "controls": {
      "wind": "雨幕倾角",
      "water": "雨幕与溅水",
      "light": "店灯呼吸"
    },
    "hint": "像素雨幕落下、地面溅水与便利店灯光呼吸。"
  },
  "05": {
    "controls": {
      "wind": "风车转速",
      "cloud": "几何云漂移"
    },
    "hint": "浮岛风车转动，几何云团从岛屿下方缓缓漂过。"
  },
  "06": {
    "controls": {
      "wind": "雨幕倾角",
      "water": "雨幕与湿反光",
      "cloud": "港口薄雾"
    },
    "hint": "雨线穿过港口，水面与霓虹湿反光同节奏变化，港雾缓缓流动。"
  },
  "07": {
    "controls": {
      "light": "流动光影"
    },
    "hint": "光沿陶瓷表面扫过，接触阴影轻轻呼吸。"
  },
  "08": {
    "controls": {
      "water": "落沙流速",
      "cloud": "薄雾与浮尘"
    },
    "hint": "细沙从悬石间连续落下，周围薄雾与浮尘缓缓流动。"
  },
  "09": {
    "controls": {
      "water": "海浪与泡沫",
      "cloud": "海雾流动"
    },
    "hint": "长浪与泡沫向岸边推进，海雾沿远海和岸壁流动。"
  },
  "10": {
    "controls": {
      "cloud": "星云漂流",
      "light": "星点明暗"
    },
    "hint": "彩色星云与细星缓缓漂流，亮星交替闪烁。"
  },
  "11": {
    "controls": {
      "water": "气泡与水纹",
      "light": "水光与焦散"
    },
    "hint": "气泡上浮、水纹流动，扇形水光与海床焦散交替推进。"
  },
  "12": {
    "controls": {
      "water": "湖面光纹",
      "cloud": "极光帘波动",
      "light": "极光与星点"
    },
    "hint": "三层极光帘波动、湖面光纹起伏与星点呼吸。"
  },
  "13": {
    "controls": {
      "wind": "掠沙"
    },
    "hint": "细沙沿沙脊掠过，近处薄尘与热光随风推进。"
  },
  "14": {
    "controls": {
      "light": "流动光影"
    },
    "hint": "宽光束横扫纸层，让纸边与层间阴影交替显现。"
  },
  "15": {
    "controls": {
      "wind": "花叶与萤火轨迹",
      "light": "萤火亮灭"
    },
    "hint": "花叶轻摆、花瓣飘落，萤火沿连续轨迹穿行并明灭。"
  }
};
const styleNames={oil:'印象油画',ink:'水墨山水',ukiyoe:'浮世绘版画',pixel:'像素艺术',lowpoly:'低多边形',cyberpunk:'赛博朋克',minimal:'极简抽象',surreal:'超现实主义',film:'胶片摄影',space:'宇宙深空',underwater:'水下梦境',aurora:'极地光影',desert:'沙漠摄影',papercut:'纸雕艺术',garden:'梦幻花园'};
const styleLabel=scene=>scene.styleLabel||styleNames[scene.style]||scene.style||scene.category;
const icons = {
  play:'<path d="m8 5 11 7-11 7V5Z"/>', pause:'<path d="M8 5v14M16 5v14"/>',
  sound:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M16 8a6 6 0 010 8m3-11a10 10 0 010 14"/>',
  mute:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 6 6m0-6-6 6"/>',
  settings:'<path d="M3 7h18M3 17h18"/><circle cx="9" cy="7" r="3" fill="#233323"/><circle cx="16" cy="17" r="3" fill="#233323"/>',
  heart:'<path d="M20.8 5.6a5.3 5.3 0 0 0-7.5 0L12 6.9l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 22l8.8-8.9a5.3 5.3 0 0 0 0-7.5Z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  shrink:'<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/>'
};
function icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;}
function readStorage(key, fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}}
function saveFavorites(){try{localStorage.setItem('stillscape-favorites',JSON.stringify([...favorites]));}catch{}updateFavoriteCount();}
function toast(text){$('#gallery-toast').textContent=text;$('#gallery-toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#gallery-toast').classList.remove('show'),3300);}
function labelFor(scene){return scene.category || '其他风景';}
function reviewFor(scene){
  // The current badges come exclusively from the new motion-specific review.
  // Historical eight-dimension scores never promote the revised motion version.
  const r=scene.motionReview||{};
  const status=String(r.status||'unverified').toLowerCase();
  if(status==='passed')return {status:'passed',label:scene.kind==='embedded'&&!scene.isNew?'交互已验证':'动效已复验',raw:r};
  if(['revise','revision'].includes(status))return {status:'revision',label:'动效精修中',raw:r};
  return {status:'pending',label:'动效待复验',raw:r};
}
function updateFavoriteCount(){$('#favorite-count').textContent=String(sceneList.filter(s=>favorites.has(s.id)).length);}
function toggleFavorite(scene){const restoreFocus=$('#viewer').hidden&&document.activeElement?.classList.contains('favorite-button');if(favorites.has(scene.id))favorites.delete(scene.id);else favorites.add(scene.id);saveFavorites();renderGrid();updateViewerFavorite();if(restoreFocus){const target=$$('.favorite-button').find(b=>b.dataset.scene===scene.id);target?.focus({preventScroll:true});}}
function updateViewerFavorite(){const scene=sceneList[currentIndex];if(!scene)return;const active=favorites.has(scene.id);$('#viewer-favorite').setAttribute('aria-pressed',String(active));$('#viewer-favorite').setAttribute('aria-label',active?'取消收藏此作品':'收藏此作品');}
function initialize(){
  $('#copyright-year').textContent=String(new Date().getFullYear());$('#hero-count').textContent=String(sceneList.length).padStart(2,'0');$('#nav-count').textContent=String(sceneList.length).padStart(2,'0');
  const featured=sceneList.find(s=>s.featured)||sceneList.find(s=>s.isNew)||sceneList[0];if(featured){$('.hero-image').src=featured.image;$('#hero-scene-title').textContent=featured.title;$('#hero-scene-style').textContent=featured.subtitle||featured.style;$('#hero-enter').onclick=()=>openScene(sceneList.indexOf(featured));$('.hero-index').firstChild.textContent=String(sceneList.indexOf(featured)+1).padStart(2,'0')+' ';}else{$('#hero-enter').disabled=true;$('#hero-scene-title').textContent='风景正在准备中';}
  const categories=['全部作品',...(sceneList.some(s=>s.isNew)?['最新作品']:[]),...new Set(sceneList.map(labelFor))];const filterRoot=$('#category-filters');for(const name of categories){const button=document.createElement('button');button.textContent=name;button.setAttribute('aria-pressed',String(name===category));button.onclick=()=>{category=name;renderFilters();renderGrid()};filterRoot.append(button);}
  $('#scene-search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderGrid()});
  $('#favorites-filter').onclick=()=>{favoritesOnly=!favoritesOnly;$('#favorites-filter').setAttribute('aria-pressed',String(favoritesOnly));renderGrid();$('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  $('#clear-filters').onclick=resetFilters;$('#empty-reset').onclick=resetFilters;
  $('#about-open').onclick=()=>$('#about-dialog').showModal();$('#standards-open').onclick=()=>{renderStandards();$('#standards-dialog').showModal()};
  for(const dialog of $$('dialog')){dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});}
  $('#motion-toggle').innerHTML=icon('pause');$('#sound-toggle').innerHTML=icon('mute');$('#settings-open').innerHTML=icon('settings');$('#viewer-favorite').innerHTML=icon('heart');$('#immersive-toggle').innerHTML=icon('eye');$('#fullscreen-toggle').innerHTML=icon('full');
  $('#viewer-back').onclick=()=>closeViewer();$('#scene-prev').onclick=()=>stepScene(-1);$('#scene-next').onclick=()=>stepScene(1);$('#motion-toggle').onclick=toggleMotion;$('#sound-toggle').onclick=toggleSound;$('#settings-open').onclick=()=>$('#settings-dialog').showModal();$('#motion-status').onclick=toggleMotion;$('#embedded-retry').onclick=()=>{if(currentIndex>=0)openScene(currentIndex,false)};$('#viewer-favorite').onclick=()=>{if(sceneList[currentIndex])toggleFavorite(sceneList[currentIndex])};$('#immersive-toggle').onclick=()=>setImmersive(!immersive);$('#restore-interface').onclick=()=>setImmersive(false);$('#fullscreen-toggle').onclick=toggleFullscreen;$('#download-frame').onclick=downloadFrame;$('#viewer-info').onclick=showSceneInfo;
  for(const slider of $$('[data-setting]'))slider.addEventListener('input',e=>{const name=e.target.dataset.setting;settings[name]=Number(e.target.value)/100;$(`#setting-${name}-value`).value=name==='speed'?`${settings[name].toFixed(2)}×`:`${e.target.value}%`;engine?.setSettings(settings);postEmbedded('settings',settings);updateMotionStatus();if(sound)sound.setVolume(settings.volume);});
  $('#reset-settings').onclick=()=>{Object.assign(settings,{wind:1,water:1,cloud:1,light:1,speed:1,power:1,volume:.3});syncSettings();engine?.setSettings(settings);postEmbedded('settings',settings);postEmbedded('reset');sound?.setVolume(settings.volume);updateMotionStatus();};
  addEventListener('resize',()=>{clearTimeout(contrastResizeTimer);contrastResizeTimer=setTimeout(updateViewerContrast,80);});document.addEventListener('keydown',onKey);document.addEventListener('fullscreenchange',()=>{$('#fullscreen-toggle').innerHTML=icon(document.fullscreenElement?'shrink':'full');$('#fullscreen-toggle').setAttribute('aria-label',document.fullscreenElement?'退出全屏':'进入全屏');});
  addEventListener('message',sendEmbeddedArtwork);
  addEventListener('message',onEmbeddedMessage);
  addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('scene');const i=sceneList.findIndex(s=>s.id===id);if(i>=0)openScene(i,false);else closeViewer(false);});
  updateFavoriteCount();renderGrid();updateClock();setInterval(updateClock,1000);
  const requested=new URL(location.href).searchParams.get('scene');const index=sceneList.findIndex(s=>s.id===requested);if(index>=0)openScene(index,false);
}
function renderFilters(){$$('#category-filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===category)));}
function resetFilters(){category='全部作品';query='';favoritesOnly=false;$('#scene-search').value='';$('#favorites-filter').setAttribute('aria-pressed','false');renderFilters();renderGrid();}
function filteredScenes(){return sceneList.filter(s=>(category==='全部作品'||(category==='最新作品'&&s.isNew)||labelFor(s)===category)&&(!favoritesOnly||favorites.has(s.id))&&(!query||[s.title,s.subtitle,s.style,styleLabel(s),s.category,s.description].filter(Boolean).join(' ').toLowerCase().includes(query)));}
function renderGrid(){const list=filteredScenes();const root=$('#art-grid');root.replaceChildren();$('#results-count').textContent=`${favoritesOnly?'收藏的作品':'全部作品'} / ${String(list.length).padStart(2,'0')}`;$('#clear-filters').hidden=category==='全部作品'&&!query&&!favoritesOnly;$('#empty-state').hidden=list.length>0;
  list.forEach((scene,index)=>{const originalIndex=sceneList.indexOf(scene);const article=document.createElement('article');article.className=`artwork${index===0||index===6?' featured':''}`;const frame=document.createElement('div');frame.className='art-preview';const open=document.createElement('button');open.className='art-open';open.setAttribute('aria-label',`打开动态壁纸：${scene.title}`);open.onclick=()=>openScene(originalIndex);const img=document.createElement('img');img.src=scene.image;img.alt=scene.title;img.loading='lazy';img.decoding='async';open.append(img);const overlay=document.createElement('span');overlay.className='art-overlay';open.append(overlay);const number=document.createElement('span');number.className='art-index';number.textContent=String(originalIndex+1).padStart(2,'0');open.append(number);const arrow=document.createElement('span');arrow.className='art-enter';arrow.textContent='↗';open.append(arrow);frame.append(open);const favorite=document.createElement('button');favorite.className='favorite-button';favorite.dataset.scene=scene.id;favorite.textContent=favorites.has(scene.id)?'♥':'♡';favorite.setAttribute('aria-label',`${favorites.has(scene.id)?'取消收藏':'收藏'}${scene.title}`);favorite.setAttribute('aria-pressed',String(favorites.has(scene.id)));favorite.onclick=()=>toggleFavorite(scene);frame.append(favorite);article.append(frame);const meta=document.createElement('div');meta.className='art-meta';const text=document.createElement('div');const title=document.createElement('h3');title.textContent=scene.title;const sub=document.createElement('p');sub.textContent=styleLabel(scene)||scene.subtitle||labelFor(scene);text.append(title,sub);meta.append(text);const review=reviewFor(scene);const badge=document.createElement('span');badge.className=`review-label ${review.status}`;badge.textContent=review.label;meta.append(badge);article.append(meta);root.append(article);});
}
async function sendEmbeddedArtwork(event){
  const frame=embeddedFrame,scene=sceneList[currentIndex],token=openToken;
  if(!frame||event.source!==frame.contentWindow||event.data?.type!=='art-image-request'||!scene?.isNew||event.data.id!==scene.id)return;
  try{
    const response=await fetch(scene.image,{credentials:'omit'});
    if(!response.ok)throw Error('Artwork unavailable');
    const blob=await response.blob();
    const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
    if(token===openToken&&frame===embeddedFrame)frame.contentWindow.postMessage({type:'art-image',id:scene.id,url},'*');
  }catch{if(token===openToken&&frame===embeddedFrame)frame.contentWindow.postMessage({type:'art-image',id:scene.id,error:true},'*');}
}
function isEmbedded(){return sceneList[currentIndex]?.kind==='embedded';}
function disposeEmbedded(){embeddedReady=false;embeddedCapabilities={};if(snapshotRequest){clearTimeout(snapshotRequest.timer);snapshotRequest.reject(Error('作品已切换'));snapshotRequest=null;}$('#viewer').classList.remove('embedded-immersive');clearTimeout(embeddedLoadTimer);if(embeddedFrame){embeddedFrame.onload=null;embeddedFrame.onerror=null;embeddedFrame.remove();embeddedFrame=null;}$('#embedded-stage').replaceChildren();$('#embedded-error').hidden=true;}
function configureSceneMotionControls(scene){
  const spec=scene.kind==='embedded'?{controls:{},hint:`${scene.subtitle||'交互动态场景'}。调整动态速度与动态强度；强度为零时停留在当前时刻。`}:sceneMotionControls[String(scene.id).slice(0,2)]||{controls:{},hint:'用动态速度与环境音量，调整此刻的节奏。'};
  for(const key of ['wind','water','cloud','light']){
    const slider=$(`#setting-${key}`),label=slider.closest('label'),name=spec.controls[key];
    label.hidden=!name;slider.disabled=!name;
    if(name){label.querySelector('.setting-label').textContent=name;slider.setAttribute('aria-label',name);}
  }
  $('#setting-power').closest('label').hidden=scene.kind!=='embedded';
  $('.volume-setting').hidden=scene.kind==='embedded';
  $('#scene-options').replaceChildren();
  for(const option of scene.embedControls||[]){const button=document.createElement('button');button.textContent=option.label;button.type='button';button.disabled=!embeddedReady;if(option.type==='toggle')button.setAttribute('aria-pressed',String(Boolean(option.default)));button.onclick=()=>{if(option.type==='toggle'){const value=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(value));postEmbedded('action',{key:option.key,value});}else postEmbedded(option.key==='reset'?'reset':'action',{key:option.key});};$('#scene-options').append(button);}
  $('#settings-context').textContent=`主要运动：${spec.hint}`;
  $('#settings-open').title=`调节风景 · ${spec.hint}`;
  $('#motion-status').title=spec.hint;
}
function configureViewerKind(embedded){
  $('#viewer').classList.toggle('is-embedded',embedded);
  $('#embedded-stage').hidden=!embedded;$('#wallpaper-canvas').hidden=embedded;
  for(const id of ['motion-toggle','settings-open','download-frame'])$('#'+id).disabled=embedded;
  updateSoundButton();
}
function postEmbedded(command,value,requestId){if(embeddedReady&&embeddedFrame)embeddedFrame.contentWindow.postMessage({type:'wallpaper-control',command,value,requestId},'*');}
function onEmbeddedMessage(event){
  if(!embeddedFrame||event.source!==embeddedFrame.contentWindow)return;
  const data=event.data;if(!data||typeof data!=='object')return;
  if(data.type==='wallpaper-ready'){
    embeddedReady=true;embeddedCapabilities=data.capabilities||{};clearTimeout(embeddedLoadTimer);
    $('#viewer-loading').hidden=true;$('#viewer-fallback').hidden=true;$('#embedded-error').hidden=true;
    $('#settings-open').disabled=false;$('#download-frame').disabled=!embeddedCapabilities.snapshot;
    $$('#scene-options button').forEach(b=>b.disabled=false);
    postEmbedded('settings',settings);postEmbedded('playing',playing&&(!reducedMotionQuery.matches||motionOverride));
    for(const option of sceneList[currentIndex]?.embedControls||[])if(option.type==='toggle')postEmbedded('action',{key:option.key,value:Boolean(option.default)});
    updateMotionStatus({playing:playing&&(!reducedMotionQuery.matches||motionOverride)});
  }else if(data.type==='wallpaper-state'&&embeddedReady){if(typeof data.state?.playing==='boolean')updateMotionStatus(data.state);}
  else if(data.type==='wallpaper-key'&&typeof data.key==='string')onKey({key:data.key,code:data.code,target:$('#viewer'),preventDefault(){}});
  else if(data.type==='wallpaper-snapshot'&&snapshotRequest&&data.requestId===snapshotRequest.id){const request=snapshotRequest;snapshotRequest=null;clearTimeout(request.timer);if(typeof data.url==='string'&&data.url.startsWith('data:image/'))request.resolve(data.url);else request.reject(Error(data.error||'截帧失败'));}
  else if(data.type==='wallpaper-error'){embeddedReady=false;$('#viewer-loading').hidden=true;$('#embedded-error').hidden=false;$('#motion-toggle').disabled=true;$('#settings-open').disabled=true;$('#download-frame').disabled=true;}
}
function updateMotionStatus(frame){
  if(currentIndex<0)return;
  if(isEmbedded()){const running=frame?.playing??(actualMotionState==='playing');actualMotionState=embeddedReady?(running?'playing':'paused'):'loading';$('#motion-status-text').textContent=!embeddedReady?'动效正在准备':running?`正在播放 · ${settings.speed.toFixed(2)}×`:'动效已暂停 · 点击播放';$('#motion-status').dataset.state=actualMotionState;$('#motion-status').disabled=!embeddedReady;$('#motion-toggle').disabled=!embeddedReady;$('#motion-toggle').innerHTML=icon(running?'pause':'play');$('#motion-toggle').setAttribute('aria-pressed',String(!running));$('#motion-toggle').setAttribute('aria-label',running?'暂停动效':'继续动效');return;}
  const metrics=engine?.getMetrics?.();
  const running=frame?.playing??metrics?.playing??false;
  const reduced=metrics?.reducedMotion??reducedMotionQuery.matches;
  const overridden=metrics?.reducedMotionOverridden??motionOverride;
  const staticOnly=motionLoadFailed||metrics?.backend==='canvas2d-static';
  const loading=!engine&&!motionLoadFailed;
  actualMotionState=loading?'loading':staticOnly?'static':running?'playing':reduced&&!overridden?'reduced':'paused';
  const labels={loading:'动效正在准备',static:'当前设备使用静态预览',playing:`正在播放 · ${settings.speed.toFixed(2)}×`,reduced:'系统减少动态 · 点击播放',paused:'动效已暂停 · 点击播放'};
  const signature=`${currentIndex}:${actualMotionState}:${settings.speed}`;
  if(signature===motionStatusKey)return;motionStatusKey=signature;
  const button=$('#motion-status');
  button.dataset.state=actualMotionState;button.disabled=loading||staticOnly;
  $('#motion-status-text').textContent=labels[actualMotionState];
  button.setAttribute('aria-label',running?`${labels.playing}，点击暂停`:labels[actualMotionState]);
  $('#motion-toggle').innerHTML=icon(running?'pause':'play');
  $('#motion-toggle').disabled=loading||staticOnly;
  $('#motion-toggle').setAttribute('aria-pressed',String(!running));
  $('#motion-toggle').setAttribute('aria-label',running?'暂停动效':reduced&&!overridden?'播放动效（覆盖系统减少动态设置）':'继续动效');
}
async function loadEmbeddedScene(scene,token){
  try{
    const url=new URL(scene.src,location.origin);url.searchParams.set('embed','1');
    if(url.origin!==location.origin||!/^\/experiences\/[a-zA-Z0-9_.-]+\.html$/.test(url.pathname))throw Error('Embedded scene must use a local experience HTML.');
    // Vite may return the gallery document for an absent HTML path. Detect that
    // fallback so a missing source never recursively embeds the host gallery.
    const response=await fetch(url.href,{credentials:'omit',cache:'no-cache'});
    if(!response.ok)throw Error('Embedded experience is unavailable.');
    const source=await response.text();
    if(!/<!doctype html|<html[\s>]/i.test(source)||/id=["']gallery-app["']/.test(source))throw Error('Original experience file is not installed.');
    if(token!==openToken)return;
    const iframe=document.createElement('iframe');
    iframe.title=scene.title;iframe.src=url.href;iframe.setAttribute('sandbox','allow-scripts allow-pointer-lock allow-downloads');iframe.setAttribute('allow','fullscreen *');iframe.allowFullscreen=true;iframe.referrerPolicy='no-referrer';
    embeddedFrame=iframe;
    iframe.onload=()=>{if(token!==openToken)return;/* Readiness is acknowledged by the renderer, not document load. */};
    iframe.onerror=()=>{if(token!==openToken)return;clearTimeout(embeddedLoadTimer);$('#viewer-loading').hidden=true;$('#embedded-error').hidden=false;};
    $('#embedded-stage').append(iframe);
    embeddedLoadTimer=setTimeout(()=>{if(token!==openToken)return;iframe.onload=null;iframe.onerror=null;iframe.remove();if(embeddedFrame===iframe)embeddedFrame=null;$('#viewer-loading').hidden=true;$('#embedded-error').hidden=false;},15000);
  }catch(error){console.warn(error);if(token===openToken){$('#viewer-loading').hidden=true;$('#embedded-error').hidden=false;}}
}
async function openScene(index,changeURL=true){
  if(!sceneList[index])return;
  const scene=sceneList[index],token=++openToken,wasOpen=!$('#viewer').hidden,embedded=scene.kind==='embedded';
  motionLoadFailed=false;
  if(!wasOpen){originFocus=document.activeElement;galleryScroll=scrollY;$('#gallery-app').inert=true;document.body.style.overflow='hidden';}
  disposeEmbedded();
  currentIndex=index;$('#viewer').dataset.sceneId=scene.id;$('#viewer').hidden=false;configureViewerKind(embedded);configureSceneMotionControls(scene);
  $('#viewer-fallback').hidden=false;$('#viewer-fallback').src=scene.image;prepareViewerContrast(scene,token);$('#viewer-fallback').alt=scene.title;
  $('#viewer-title').textContent=scene.title;$('#viewer-subtitle').textContent=scene.subtitle||scene.style||'A LIVING LANDSCAPE';$('#viewer-description').textContent=scene.description||'';$('#viewer-style').textContent=styleLabel(scene)||'';$('#viewer-position').textContent=`NO. ${String(index+1).padStart(2,'0')}`;$('#scene-counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(sceneList.length).padStart(2,'0')}`;updateViewerFavorite();$('#viewer-loading').hidden=false;$('#download-frame').disabled=true;
  if(changeURL){const url=new URL(location.href);url.searchParams.set('scene',scene.id);history.pushState({scene:scene.id},'',url);}
  if(embedded){updateMotionStatus();engine?.destroy();engine=null;sound?.disable();soundOn=false;updateSoundButton();await loadEmbeddedScene(scene,token);if(token===openToken)$('#viewer-back').focus({preventScroll:true});return;}
  updateMotionStatus();
  try{
    sound?.setScene(scene);
    if(engine){await engine.setScene(scene);}else{
      const created=await createWallpaperEngine($('#wallpaper-canvas'),scene,{onFrame:frame=>{sound?.update(frame);updateMotionStatus(frame)},onError:error=>{console.error(error);toast('此设备暂时无法呈现完整动效，仍可欣赏画面')},quality:'auto',maxDpr:1.75,maxResolution:3840});
      if(token!==openToken){created?.destroy();return;}engine=created;
    }
    if(token!==openToken)return;engine?.setSettings(settings);engine?.setPlaying(playing,{userInitiated:motionOverride});updateMotionStatus();$('#download-frame').disabled=false;
  }catch(error){console.error(error);if(token===openToken){motionLoadFailed=true;updateMotionStatus();toast('动态风景加载遇到问题，已保留静态画面');}}
  finally{if(token===openToken)$('#viewer-loading').hidden=true;}
  if(!wasOpen&&token===openToken)$('#viewer').focus({preventScroll:true});
}
// Read contrast from the actual artwork beneath each UI group. Black bars are
// sampled as dark, so a pale painting never turns text black over letterboxing.
const contrastGroups=['.viewer-caption','.viewer-time','.back-button','.viewer-location','.round-button','.scene-pager','.download-button'];
async function prepareViewerContrast(scene,token){
  contrastPixels=null;contrastImage=null;
  for(const selector of contrastGroups){const el=$(selector);el.classList.add('tone-aware');el.dataset.contrast='glass';}
  try{
    const image=new Image();image.src=scene.image;await image.decode();
    if(token!==openToken)return;
    const sample=document.createElement('canvas');sample.width=192;sample.height=Math.max(1,Math.round(192*image.height/image.width));
    const context=sample.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0,sample.width,sample.height);
    contrastPixels=context.getImageData(0,0,sample.width,sample.height).data;contrastWidth=sample.width;contrastHeight=sample.height;contrastImage=image;
    requestAnimationFrame(updateViewerContrast);
  }catch{ /* A dark local surface remains as the accessible loading fallback. */ }
}
function updateViewerContrast(){
  if(!contrastPixels||!contrastImage||currentIndex<0||$('#viewer').hidden)return;
  if(isEmbedded()){for(const selector of contrastGroups)$(selector).dataset.contrast='glass';return;}
  const scene=sceneList[currentIndex],bounds=$('#viewer').getBoundingClientRect();
  const scale=scene.fit==='cover'?Math.max(bounds.width/contrastImage.width,bounds.height/contrastImage.height):Math.min(bounds.width/contrastImage.width,bounds.height/contrastImage.height);
  const w=contrastImage.width*scale,h=contrastImage.height*scale,focus=scene.focus||[.5,.5];
  const left=bounds.width*.5-w*focus[0],top=bounds.height*.5-h*focus[1];
  const linear=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)};
  for(const selector of contrastGroups){
    const el=$(selector),r=el.getBoundingClientRect(),values=[];let outside=0;
    for(let y=0;y<7;y++)for(let x=0;x<14;x++){
      const u=(r.left-bounds.left+r.width*(x+.5)/14-left)/w,v=(r.top-bounds.top+r.height*(y+.5)/7-top)/h;
      if(u<0||u>=1||v<0||v>=1){outside++;values.push(.008);continue;}
      const i=(Math.floor(v*contrastHeight)*contrastWidth+Math.floor(u*contrastWidth))*4;
      values.push(.2126*linear(contrastPixels[i])+.7152*linear(contrastPixels[i+1])+.0722*linear(contrastPixels[i+2]));
    }
    values.sort((a,b)=>a-b);
    const low=values[Math.floor(values.length*.12)],high=values[values.length-1];
    const forceDark=scene.uiTone==='dark'&&outside===0;
    // Uniform bright areas use an ivory gallery label with ink lettering. Mixed
    // bright/dark areas use smoked glass; deep dark regions need no extra plate.
    el.dataset.contrast=(forceDark||low>.30)&&outside===0?'ink':high>.15?'glass':'light';
  }
}
async function closeViewer(changeURL=true){if($('#viewer').hidden)return;++openToken;disposeEmbedded();engine?.destroy();engine=null;if(soundOn){sound?.disable();soundOn=false;updateSoundButton();}if(document.fullscreenElement){try{await document.exitFullscreen();}catch{}}for(const d of $$('dialog[open]'))d.close();setImmersive(false);$('#viewer').hidden=true;$('#gallery-app').inert=false;document.body.style.overflow='';currentIndex=-1;if(changeURL){const url=new URL(location.href);url.searchParams.delete('scene');history.pushState({},'',url);}scrollTo(0,galleryScroll);originFocus?.focus?.({preventScroll:true});}
function stepScene(delta){if(currentIndex<0||sceneList.length<2)return;openScene((currentIndex+delta+sceneList.length)%sceneList.length);}
function toggleMotion(){
  if(isEmbedded()){if(!embeddedReady)return;playing=actualMotionState!=='playing';if(playing)motionOverride=true;postEmbedded('playing',playing);return;}
  if(!engine)return;
  playing=actualMotionState!=='playing';
  if(playing)motionOverride=true;
  engine.setPlaying(playing,{userInitiated:true});
  updateMotionStatus();
  if(!playing)sound?.update({time:0,delta:0,wind:settings.wind,water:settings.water,cloud:settings.cloud,gust:0,playing:false,sceneId:sceneList[currentIndex]?.id});
}
function updateSoundButton(){$('#sound-toggle').disabled=isEmbedded();$('#sound-toggle').title=isEmbedded()?'此作品无环境声':'环境声音';$('#sound-toggle').innerHTML=icon(soundOn?'sound':'mute');$('#sound-toggle').setAttribute('aria-pressed',String(soundOn));$('#sound-toggle').setAttribute('aria-label',isEmbedded()?'此作品无环境声':soundOn?'关闭声音':'开启声音');}
async function toggleSound(){if(isEmbedded())return;try{if(!sound)sound=new Soundscape();if(soundOn){sound.disable();soundOn=false;}else{sound.setScene(sceneList[currentIndex]);sound.setVolume(settings.volume);await sound.enable();soundOn=true;if(!playing)sound.update({time:0,wind:settings.wind,water:settings.water,cloud:settings.cloud,gust:0,playing:false});}updateSoundButton();toast(soundOn?'环境声已开启 · 建议以舒适音量聆听':'环境声已关闭');}catch(error){console.error(error);toast('当前设备无法播放环境声');}}
function setImmersive(value){immersive=value;$('#viewer').classList.toggle('is-immersive',value);$$('.viewer-ui').forEach(el=>el.inert=value);$('#restore-interface').hidden=!value;if(value)$('#restore-interface').focus({preventScroll:true});else if(!$('#viewer').hidden)$('#immersive-toggle').focus({preventScroll:true});}
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('此浏览器不支持全屏，可使用隐藏界面模式');}catch{toast('暂时无法进入全屏，可使用隐藏界面模式');}}
function syncSettings(){for(const [name,value]of Object.entries(settings)){$(`#setting-${name}`).value=String(Math.round(value*100));$(`#setting-${name}-value`).value=name==='speed'?`${value.toFixed(2)}×`:`${Math.round(value*100)}%`;}}
async function downloadFrame(){const scene=sceneList[currentIndex];if(!scene)return;const token=openToken;if(isEmbedded()&&!embeddedReady)return;const button=$('#download-frame');button.disabled=true;try{let blob;if(isEmbedded()){const data=await new Promise((resolve,reject)=>{const id=++snapshotSequence;const timer=setTimeout(()=>{snapshotRequest=null;reject(Error('截帧超时'));},10000);snapshotRequest={id,resolve,reject,timer};postEmbedded('snapshot',null,id);});blob=await(await fetch(data)).blob();}else if(engine)blob=await engine.snapshot({width:3840,height:2160,type:'image/png'});else{const response=await fetch(scene.image);if(!response.ok)throw Error('下载失败');blob=await response.blob();}if(token!==openToken)return;if(!blob)throw Error('未取得画面');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Stillscape-${scene.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),20000);toast('此刻的光影，已为你留存');}catch(error){console.error(error);if(token===openToken)toast('画面暂时无法下载，请稍后重试');}finally{if(token===openToken)button.disabled=false;}}
function showSceneInfo(){
  const scene=sceneList[currentIndex];if(!scene)return;
  $('#info-title').textContent=scene.title;$('#info-description').textContent=scene.description||scene.subtitle||'';
  const dl=$('#info-details');dl.replaceChildren();
  for(const [term,value]of [['风格',styleLabel(scene)],['系列',scene.category],['画面',scene.dimensions?`${scene.dimensions.width} × ${scene.dimensions.height}`:scene.resolution],['创作',scene.credit||(scene.kind==='embedded'?'用户提供的独立交互作品':'原创生成画面与动态设计')]]){
    if(!value)continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term;dd.textContent=value;dl.append(dt,dd);
  }
  const review=reviewFor(scene),root=$('#info-review');root.replaceChildren();
  const title=document.createElement('strong');title.textContent=`动效专项复验 · ${review.label}`;root.append(title);
  const note=document.createElement('p');
  const detail=review.raw.summary||review.raw.note;
  const defaultNotes={passed:'本轮专项复验已通过，结果仅对应当前动效或交互版本。',revision:'本轮动效需要继续精修，完成后重新验证。',pending:'本轮动效尚未完成复验，历史成绩不作为本版本通过依据。'};
  note.textContent=Array.isArray(detail)?detail.join('；'):detail||defaultNotes[review.status];root.append(note);
  const scope=document.createElement('p');scope.className='review-scope-note';scope.textContent='原八维成绩仅保留在历史报告中，不与本轮专项结果拼接。';root.append(scope);
  const url=scene.referenceUrl||scene.sourceUrl;
  if(url&&/^https?:\/\//.test(url)){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='查看风格参考来源 ↗';root.append(a);}
  $('#info-dialog').showModal();
}
function renderStandards(){const passed=sceneList.filter(s=>reviewFor(s).status==='passed').length;const pending=sceneList.length-passed;const root=$('#standard-summary');root.replaceChildren();for(const [number,text]of [[sceneList.length,'收录作品'],[passed,'本轮复验通过'],[pending,'待复验']]){const span=document.createElement('span');const strong=document.createElement('strong');strong.textContent=String(number).padStart(2,'0');span.append(strong,document.createTextNode(text));root.append(span);}}
function updateClock(){const now=new Date();$('#viewer-clock').textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});$('#viewer-clock').dateTime=now.toISOString();$('#viewer-date').textContent=now.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'});}
function onKey(e){if($('#viewer').hidden||e.ctrlKey||e.metaKey||e.altKey||e.repeat||$('dialog[open]')||e.target.closest('input,textarea,select'))return;const key=e.key.toLowerCase();if(key==='h'){e.preventDefault();setImmersive(!immersive);}else if(key==='m'){e.preventDefault();toggleSound();}else if(key==='f'){e.preventDefault();toggleFullscreen();}else if(key==='escape'){if(immersive)setImmersive(false);else closeViewer();}else if(key==='arrowleft'){e.preventDefault();stepScene(-1);}else if(key==='arrowright'){e.preventDefault();stepScene(1);}else if(e.code==='Space'&&!e.target.closest('button,a')){e.preventDefault();toggleMotion();}}
initialize();
