(()=>{'use strict';
if(new URLSearchParams(location.search).get('embed')==='1')document.body.classList.add('embedded');
try{
if(!window.THREE)throw Error('3D 引擎未能载入，请刷新重试。');
const T=THREE,scene=new T.Scene();scene.fog=new T.FogExp2(0x080e22,.0008);
const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6,2560/innerWidth,1600/innerHeight));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;document.body.prepend(renderer.domElement);
const camera=new T.PerspectiveCamera(56,innerWidth/innerHeight,.2,4000);
scene.add(new T.HemisphereLight(0xadcfff,0x222846,3.2));const sun=new T.DirectionalLight(0xffddb1,3.2);sun.position.set(-120,160,120);scene.add(sun);const blue=new T.DirectionalLight(0x709bff,2.5);blue.position.set(80,-20,-140);scene.add(blue);
let seed=241;function rnd(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
function mesh(g,m,parent=scene,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
function mat(c,metal=.65,rough=.4){return new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});}
const hull=mat(0xb5c3ce,.75,.3),dark=mat(0x192b43,.78,.4),edge=mat(0x536e89,.8,.35),gold=mat(0xb69a68,.65,.42),glass=new T.MeshPhysicalMaterial({color:0x123b63,metalness:.8,roughness:.15,clearcoat:1});const cyan=new T.MeshBasicMaterial({color:0x70c3e6}),amber=new T.MeshBasicMaterial({color:0xd9ac69});
function box(parent,w,h,d,m,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),m,parent,x,y,z);}
function beam(parent,a,b,r,m){const delta=new T.Vector3().subVectors(b,a),o=mesh(new T.CylinderGeometry(r,r,delta.length(),5),m,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
// A deterministic, layered painted sky: no image or network assets.
const skyCanvas=document.createElement('canvas');skyCanvas.width=2048;skyCanvas.height=1024;const ctx=skyCanvas.getContext('2d');ctx.fillStyle='#030712';ctx.fillRect(0,0,2048,1024);
for(let i=0;i<95;i++){const x=rnd()*2048,y=240+150*Math.sin(x*.004)+rnd()*220,r=80+rnd()*240;const grad=ctx.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,i%3?'rgba(56,37,105,.09)':'rgba(31,88,131,.1)');grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(x-r,y-r,r*2,r*2);}
for(let i=0;i<2200;i++){ctx.fillStyle=`rgba(190,211,242,${.12+rnd()*.65})`;const r=rnd()<.018?1.6:.35+rnd()*.55;ctx.beginPath();ctx.arc(rnd()*2048,rnd()*1024,r,0,Math.PI*2);ctx.fill();}
const skyTexture=new T.CanvasTexture(skyCanvas);skyTexture.colorSpace=T.SRGBColorSpace;
const sky=mesh(new T.SphereGeometry(2200,48,32),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{stars:{value:skyTexture}},vertexShader:`varying vec3 p;varying vec2 uvv;void main(){p=position/2200.;uvv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 p;varying vec2 uvv;uniform sampler2D stars;float hash(vec3 q){return fract(sin(dot(q,vec3(127.1,311.7,74.7)))*43758.5453);}float noise(vec3 q){vec3 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}float fbm(vec3 q){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(q);q=q*2.03+3.4;a*=.5;}return v;}void main(){vec3 q=normalize(p);float n=fbm(q*5.);float cloud=fbm(q*9.+n*4.);float band=exp(-pow((q.y+.1+q.x*.33+(n-.5)*.6)*2.7,2.));float dust=smoothstep(.24,.72,cloud)*band;vec3 col=mix(vec3(.018,.028,.065),vec3(.15,.085,.28),dust);col+=vec3(.03,.13,.2)*pow(cloud,2.)*band;col*=.7+.5*fbm(q*32.);col+=texture2D(stars,uvv).rgb*.75;gl_FragColor=vec4(col,1.);}`}));
// Banded, weathered gas giant, its terminator shaped by real lighting.
const pc=document.createElement('canvas');pc.width=1024;pc.height=512;const pctx=pc.getContext('2d');for(let y=0;y<512;y++){const v=Math.sin(y*.115)*.5+Math.sin(y*.39)*.18+Math.sin(y*.023)*.7;pctx.fillStyle=`hsl(${29+v*7},${24+v*8}%,${40+v*11}%)`;pctx.fillRect(0,y,1024,1);}for(let i=0;i<100;i++){pctx.fillStyle='rgba(230,204,168,.025)';pctx.beginPath();pctx.ellipse(rnd()*1024,rnd()*512,20+rnd()*160,2+rnd()*8,0,0,Math.PI*2);pctx.fill();}const pixels=pctx.getImageData(0,0,1024,512);for(let y=0;y<512;y++)for(let x=0;x<1024;x++){const yy=y+4*Math.sin(x*.025+y*.06)+2*Math.sin(x*.069-y*.033);const band=Math.sin(yy*.115)*.5+Math.sin(yy*.39)*.18+Math.sin(yy*.023)*.7;const grain=rnd()*5;const storm=Math.exp(-((x-260)*(x-260)/3400+(y-305)*(y-305)/160));const v=(y*1024+x)*4;pixels.data[v]=111+band*32+grain+storm*32;pixels.data[v+1]=91+band*27+grain-storm*11;pixels.data[v+2]=72+band*22+grain-storm*16;}pctx.putImageData(pixels,0,0);const pt=new T.CanvasTexture(pc);pt.colorSpace=T.SRGBColorSpace;
const giant=mesh(new T.SphereGeometry(135,72,48),new T.MeshStandardMaterial({map:pt,roughness:1,metalness:0}),scene,-265,140,-720);giant.rotation.z=.24;
const ringMat=new T.MeshStandardMaterial({color:0xb5a18a,side:T.DoubleSide,transparent:true,opacity:.47,metalness:.1,roughness:1});const planetRing=mesh(new T.RingGeometry(164,225,160),ringMat,giant);planetRing.rotation.x=1.18;planetRing.rotation.y=.12;
const atmosphereMaterial=new T.ShaderMaterial({transparent:true,side:T.FrontSide,depthWrite:false,blending:T.AdditiveBlending,vertexShader:'varying vec3 nn;varying vec3 vv;void main(){vec4 p=modelViewMatrix*vec4(position,1.);nn=normalize(normalMatrix*normal);vv=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 nn;varying vec3 vv;void main(){float r=pow(1.-max(dot(normalize(nn),normalize(vv)),0.),3.);gl_FragColor=vec4(.35,.55,1.,r*.24);}'});mesh(new T.SphereGeometry(137,64,40),atmosphereMaterial,giant);
const moon=mesh(new T.SphereGeometry(54,48,32),mat(0x526b92,.15,.98),scene,265,-72,-1020);
// Exploratory vessel: split nacelles, swept wings, cockpit, radiator fins and greebles.
const ship=new T.Group();scene.add(ship);function armoredBody(){const verts=[],idx=[];const sections=[[-7,.08,.07],[-4.5,.85,.42],[-1.8,1.65,.82],[2.3,1.8,.7],[4.8,1.05,.44]];for(const [z,w,h] of sections){for(const [x,y] of [[-w*.7,h],[w*.7,h],[w,h*.15],[w*.7,-h],[-w*.7,-h],[-w,h*.15]])verts.push(x,y,z);}for(let j=0;j<4;j++)for(let k=0;k<6;k++){let a=j*6+k,b=j*6+(k+1)%6,c=a+6,d=b+6;idx.push(a,b,c,b,d,c);}idx.push(24,25,26,24,26,27,24,27,28,24,28,29);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();return mesh(geo,hull,ship);}armoredBody();

const cockpit=mesh(new T.SphereGeometry(1,20,14),glass,ship,0,.8,-2.7);cockpit.scale.set(.83,.44,1.75);
for(const side of [-1,1]){for(let k=0;k<6;k++){const p=box(ship,.34,.15,.6,dark,side*1.22,.77,-.6+k*.65);p.rotation.z=side*.16;box(ship,.06,.04,.41,gold,side*1.22,.86,-.6+k*.65);}box(ship,.1,.06,3.6,cyan,side*.83,.85,-.2);const panel=box(ship,.63,.12,2.2,edge,side*.91,.66,3.2);panel.rotation.y=side*.16;}
const tail=mesh(new T.CylinderGeometry(.63,.63,.18,24),dark,ship,0,0,4.91);tail.rotation.x=Math.PI/2;mesh(new T.CircleGeometry(.44,24),amber,ship,0,0,5.02);
box(ship,.16,.1,6.6,gold,0,1.16,.4);box(ship,.9,.7,2,dark,0,-.9,1);
const wingShape=new T.Shape();wingShape.moveTo(.7,1);wingShape.lineTo(4.8,1.9);wingShape.lineTo(7.2,5.5);wingShape.lineTo(6.3,6.2);wingShape.lineTo(1.1,4.1);wingShape.closePath();
for(const s of [-1,1]){const wing=mesh(new T.ExtrudeGeometry(wingShape,{depth:.22,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.08,bevelThickness:.05}),hull,ship);wing.rotation.x=Math.PI/2;wing.scale.x=s;wing.position.z=-2;
for(let q=0;q<4;q++){const arm=box(ship,2.5,.1,.13,edge,s*3.1,.12,q*.5+.3);arm.rotation.y=-s*.3;}
const inset=box(ship,1.8,.08,1.6,dark,s*2.8,.13,1.6);inset.rotation.y=s*.3;box(ship,.09,.1,2.5,amber,s*5.7,.1,2.4);
const nac=mesh(new T.CylinderGeometry(.69,.82,5.8,12),dark,ship,s*4.65,0,2);nac.rotation.x=Math.PI/2;box(ship,.45,.23,5.2,hull,s*4.65,.7,1.6);box(ship,.08,.09,3.8,cyan,s*4.95,.76,1.3);
for(let k=0;k<5;k++)box(ship,.9,.08,.3,edge,s*4.65,.6,k*.57+.8);
const fin=box(ship,.13,1.7,2.3,dark,s*3.6,.7,3);fin.rotation.z=s*.3;box(ship,1.3,.14,.25,gold,s*2.4,.08,1.9);
const nozzle=mesh(new T.CylinderGeometry(.7,.56,.65,16,1,true),edge,ship,s*4.65,0,5.1);nozzle.rotation.x=Math.PI/2;mesh(new T.CircleGeometry(.5,24),cyan,ship,s*4.65,0,5.46);
}
// Soft engine plumes built in geometry, with additive falloff.
const flameMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,uniforms:{phase:{value:0}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;uniform float phase;void main(){float a=pow(1.0-vUv.y,1.6)*(.7+.1*sin(vUv.y*22.0-phase*13.0));gl_FragColor=vec4(mix(vec3(.12,.25,.75),vec3(.4,.85,1.),1.0-vUv.y),a*.42);}'});
for(const s of [-1,1]){const f=mesh(new T.CylinderGeometry(.04,.48,5,16,1,true),flameMaterial,ship,s*4.65,0,7.9);f.rotation.x=Math.PI/2;}
const transit=[];
function makeGate(index){const g=new T.Group();scene.add(g);const radius=47+index%2*9;
mesh(new T.TorusGeometry(radius,3.7,8,96),dark,g);mesh(new T.TorusGeometry(radius-2,.18,5,96),cyan,g);mesh(new T.TorusGeometry(radius+7,.8,6,96),edge,g);
const rear=mesh(new T.TorusGeometry(radius+1,2.8,8,96),edge,g,0,0,-17);mesh(new T.TorusGeometry(radius-3,.28,6,96),amber,g,0,0,-17);
for(let j=0;j<24;j++){const a=j*Math.PI/12;const sector=new T.Group();sector.position.set(Math.cos(a)*radius,Math.sin(a)*radius,0);sector.rotation.z=a;g.add(sector);box(sector,8.8,11.8,7.6,j%3===0?gold:edge);
box(sector,7,10.4,2,dark,0,0,4.6);box(sector,6.5,.2,.14,cyan,0,4.7,5.66);box(sector,6.5,.2,.14,amber,0,-4.7,5.66);
beam(sector,new T.Vector3(-3,-5,-3),new T.Vector3(3,5,-17),.55,gold);beam(sector,new T.Vector3(3,-5,-3),new T.Vector3(-3,5,-17),.42,edge);box(sector,2,3,18,dark,0,0,-8);
for(let n=0;n<4;n++)box(sector,1,.18,.16,hull,-2+n*1.4,-3.6,5.7);box(sector,.18,5.6,.12,j%3===0?amber:cyan,-3.1,0,2);box(sector,3.8,4,1.1,dark,0,0,2.25);for(let k=-1;k<=1;k++)box(sector,2.5,.18,.1,hull,0,k*1.2,2.84);
if(j%3===0){box(sector,6,1.2,15,dark,0,0,8);beam(sector,new T.Vector3(-2.3,0,1),new T.Vector3(2.3,0,15),.2,gold);box(sector,5,3,3,edge,0,0,15);}}
transit.push({g,offset:index*210,kind:'gate',index});}
for(let i=0;i<5;i++)makeGate(i);
// Off-axis stations with open triangulated trusses, solar sails and docking beacons.
for(let i=0;i<5;i++){const st=new T.Group();scene.add(st);for(let j=0;j<9;j++){const z=j*10;for(const x of [-2,2])for(const y of [-2,2])beam(st,new T.Vector3(x,y,z),new T.Vector3(x,y,z+10),.24,edge);beam(st,new T.Vector3(-2,-2,z),new T.Vector3(2,2,z+10),.19,gold);beam(st,new T.Vector3(2,-2,z),new T.Vector3(-2,2,z+10),.19,edge);if(j%2===0){box(st,22,.22,6,dark,0,0,z);for(let k=-5;k<=5;k++)box(st,.12,.3,5.8,edge,k*2,0,z);box(st,5,5,5,hull,0,0,z);box(st,.2,.2,2,amber,2.6,2.6,z);}}st.rotation.z=i*.9;transit.push({g:st,offset:i*210+100,kind:'station',index:i});}
let playing=true,speed=1,power=1,time=0,last=performance.now(),raf=0;const target=new T.Vector3();
function draw(){const travel=time*24;ship.position.set(Math.sin(time*.24)*5,Math.sin(time*.37)*2.2-4,-20);ship.rotation.set(Math.sin(time*.37)*.025,Math.cos(time*.24)*.065,-Math.cos(time*.24)*.11);flameMaterial.uniforms.phase.value=time;
camera.position.set(Math.sin(time*.24-.2)*2.1,4+Math.sin(time*.19)*.8,17);target.set(ship.position.x*.4,ship.position.y*.27,-74);camera.lookAt(target);sky.rotation.y=time*.001;giant.rotation.y=time*.008;giant.position.x=-265+Math.sin(time*.04)*12;moon.position.y=-72+Math.sin(time*.05)*6;
for(const o of transit){const z=((travel+o.offset)%1050)-970;o.g.position.set(o.kind==='gate'?Math.sin(o.index*1.7)*6:(o.index%2?83:-78),o.kind==='gate'?8+Math.cos(o.index)*6:-8,z);o.g.rotation.y=o.kind==='gate'?Math.sin(o.index*1.8)*.38:.1;o.g.rotation.z=o.kind==='gate'?o.index*.31+time*.012:o.index*.9;}
renderer.render(scene,camera);}
function loop(now){raf=0;const dt=Math.min((now-last)/1000,.05);last=now;if(playing&&power>0)time+=dt*speed*power;draw();if(playing&&power>0&&!document.hidden)raf=requestAnimationFrame(loop);}
function wake(){last=performance.now();if(!document.hidden&&!raf&&playing&&power>0)raf=requestAnimationFrame(loop);}
function setPlaying(v){playing=!!v;document.getElementById('pause').textContent=playing?'暂停航行':'继续航行';if(!playing&&raf){cancelAnimationFrame(raf);raf=0;}wake();}
function reset(){time=0;draw();wake();}
function setSettings(v){if(Number.isFinite(v.speed))speed=Math.max(.25,Math.min(3,v.speed));if(Number.isFinite(v.power))power=Math.max(0,Math.min(2,v.power));if(power===0&&raf){cancelAnimationFrame(raf);raf=0;}wake();}
document.getElementById('pause').onclick=()=>{setPlaying(!playing);WallpaperBridge.state();};document.getElementById('reset').onclick=reset;document.getElementById('speed').oninput=e=>setSettings({speed:Number(e.target.value)});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.6,2560/innerWidth,1600/innerHeight));renderer.setSize(innerWidth,innerHeight);draw();});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;const el=document.getElementById('error');el.style.display='grid';el.textContent='图形上下文已中断，请刷新页面重新启航。';WallpaperBridge.error(el.textContent);});
draw();WallpaperBridge.register({setPlaying,setSettings,reset,snapshot(){draw();return renderer.domElement.toDataURL('image/png');},getState(){return{playing,speed,power};}});wake();
}catch(e){const el=document.getElementById('error');el.style.display='grid';el.textContent='星环远征暂时无法启航：'+e.message;window.WallpaperBridge?.error(e.message);}
})();
