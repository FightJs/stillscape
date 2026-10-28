import {motionProfile} from './motion-profiles.js';
/**
 * Stillscape living-canvas engine.
 * Artwork stays geometrically intact. Only explicit safe-water pixels refract;
 * foreground cutouts have independent root-anchored transforms.
 */
const VERTEX = `attribute vec2 aPosition;
varying vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const FRAGMENT = `precision highp float;
varying vec2 vUv;
uniform sampler2D uImage,uWaterMask,uCloudTexture;
uniform vec2 uResolution,uImageSize,uFocus;
uniform float uTime,uCloudTime,uWind,uWater,uCloud,uLight,uFit,uSkyBottom,uGust,uCloudAdvection,uPixel,uHasWater,uWindFront;
uniform vec4 uEffectsA,uEffectsB,uEffectsC,uSandColumn,uSkyVortex,uSkyRegion,uBoat;
uniform vec3 uSkyProtect;
uniform vec4 uClocks,uMotion;
uniform float uScene;
uniform float uSandWidth,uFlowWaterfall,uPrintWave,uCoastal,uProtectWarm,uInkFlow,uBoatStrength;
uniform vec3 uTint;
uniform vec3 uRipples[4];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
vec2 imageUV(vec2 uv){float a=uResolution.x/uResolution.y,b=uImageSize.x/uImageSize.y;vec2 scale=uFit>.5?(a>b?vec2(a/b,1.):vec2(1.,b/a)):(a>b?vec2(1.,b/a):vec2(a/b,1.));return (uv-.5)*scale+uFocus;}
void main(){
  vec2 screen=vec2(vUv.x,1.-vUv.y),p=imageUV(screen);
  float inside=step(0.,p.x)*step(p.x,1.)*step(0.,p.y)*step(p.y,1.);
  vec2 safe=clamp(p,.001,.999);
  vec3 color=texture2D(uImage,safe).rgb;
  if(inside<.5){color=mix(vec3(.025,.033,.029),uTint*.055,.35);gl_FragColor=vec4(color,1.);return;}
  float t=uTime,wt=uClocks.x,ft=uClocks.y,lt=uClocks.z,ct=uCloudTime,water=0.;
  float localWind=exp(-pow((p.x-uWindFront)*4.2,2.));
  float waterDrive=uWater*uMotion.x*(.84+.25*localWind);
  if(uHasWater>.5)water=texture2D(uWaterMask,safe).r;
  if(uProtectWarm>.5){
    float sourceLuma=dot(color,vec3(.299,.587,.114));
    float coldWater=smoothstep(-.02,.09,color.b-color.r);
    float notDarkRock=smoothstep(.07,.25,sourceLuma);
    water*=coldWater*notDarkRock;
  }
  vec2 waterDelta=vec2(0.);
  float rippleLight=0.;
  if(water>.001 && uWater>.001){
  // The mask is eroded and feathered, so displacements die before the shore.
  if(uPixel>.5){
    // Pixel puddles stay on the source grid; discrete splashes provide response.
    waterDelta=vec2(0.);
  }else if(uCoastal>.5){
    // Two broad, oblique swells advance and recede towards this right-hand shore.
    // Source foam moves a few pixels; the explicit mask and cold-color guard
    // anchor warm cliffs, beach, and dark rock silhouettes.
    float depth=.35+.65*smoothstep(.28,.88,p.y);
    float phase=p.x*11.+p.y*8.-wt*.85;
    float surge=sin(phase)*.72+sin(phase*.63+.8)*.28;
    float coastalDrive=waterDrive/(1.+waterDrive/3.5);
    waterDelta=vec2(.0040,.0050)*surge*depth*coastalDrive*water;
  }else if(uPrintWave>.5){
    float depth=smoothstep(.50,.98,p.y);
    waterDelta=vec2(sin(p.x*7.-wt*.62)*.001,sin(p.x*9.-wt*.8)*(.0012+.0028*depth))*waterDrive*water;
  }else{
  float w1=sin(p.y*530.-wt*1.8+sin(p.x*18.+wt*.2));
  float w2=sin(p.y*870.+p.x*31.-wt*2.1)*.35;
  waterDelta=vec2(sin(p.y*330.+wt*1.1)*.00065,(w1+w2)*.0014)*waterDrive*water;
  }
  for(int i=0;i<4;i++){
    float age=wt-uRipples[i].z;
    if(age>=0. && age<16.){
    vec2 d=(p-uRipples[i].xy)*vec2(1.,2.8);
    float dist=length(d);
    float ring=sin(dist*290.-age*7.5)*exp(-pow((dist-age*.025)*38.,2.))*exp(-age*.55)*step(0.,age);
    waterDelta+=normalize(d+vec2(.00001))*ring*.0007*water*waterDrive;
    rippleLight+=ring*.012*water;
    }
  }
  }
  if(uPrintWave>.5 || uCoastal>.5){
    waterDelta*=vec2(smoothstep(0.,.10,p.x)*(1.-smoothstep(.90,1.,p.x)),
      smoothstep(0.,.10,p.y)*(1.-smoothstep(.90,1.,p.y)));
  }
  // Sampled destinations must also be water, preventing stronger maximum
  // displacement from pulling land pixels across an eroded shoreline.
  if(uHasWater>.5 && length(waterDelta)>.000001){
    waterDelta*=texture2D(uWaterMask,clamp(p+waterDelta,.001,.999)).r;
  }
  // Optional clean-sky advection is enabled only on a scene whose sky is free
  // of foreground silhouettes. Edges and the horizon stay pinned.
  vec2 cloudDelta=vec2(0.);
  if(uCloudAdvection>.5){
    float clearSky=1.-smoothstep(max(.02,uSkyBottom-.16),uSkyBottom,p.y);
    float a=4.*sin(uCloudTime*.19)*.032*uMotion.y*clearSky;
    float stretch=exp(a);
    cloudDelta.x=p.x*stretch/(1.-p.x+p.x*stretch)-p.x;
  }
  if(uSkyRegion.z>uSkyRegion.x && uSkyRegion.w>uSkyRegion.y){
    float span=uSkyRegion.z-uSkyRegion.x;
    float vertical=smoothstep(uSkyRegion.y,uSkyRegion.y+.018,p.y)
      *(1.-smoothstep(uSkyRegion.w-.018,uSkyRegion.w,p.y));
    if(p.x>uSkyRegion.x && p.x<uSkyRegion.z && vertical>.0001){
      float q=p.x;
      // Four small monotone flow steps keep the protected lunar domain fixed.
      for(int j=0;j<4;j++){
        float local=(q-uSkyRegion.x)/span;
        float protect=smoothstep(uSkyProtect.z,uSkyProtect.z+.075,length(vec2(q,p.y)-uSkyProtect.xy));
        float boundary=smoothstep(0.,.16,local)*(1.-smoothstep(.84,1.,local));
        float a=sin(uCloudTime*.17)*.026*uMotion.y/span*vertical*protect*boundary;
        float e=exp(a);
        q=uSkyRegion.x+span*local*e/(1.-local+local*e);
      }
      cloudDelta.x+=q-p.x;
    }
  }
  vec2 boatDelta=vec2(0.);
  if(uBoat.z>.001 && uBoat.w>.001){
    float boatDistance=length((p-uBoat.xy)/uBoat.zw);
    float boatMask=1.-smoothstep(.65,1.,boatDistance);
    boatDelta=vec2(sin(wt*.48+.4)*.0080,sin(wt*.95)*.0050)*boatMask*uBoatStrength/(1.+.5*uBoatStrength);
  }
  vec2 inkDelta=vec2(0.);
  if(uInkFlow>.5 && water>.01){
    vec2 fallLake=vec2(uSandColumn.z,max(.76,uSandColumn.w+.065));
    vec2 d=p-fallLake;
    float spread=exp(-pow(d.x/.13,2.)-pow(d.y/.035,2.))*water;
    inkDelta.y=sin(d.x*34.-d.y*80.-wt*.55)*.0008*spread;
    if(uBoat.z>.001){
      float ringDistance=length((p-uBoat.xy)*vec2(1.,2.4));
      float ring=sin(ringDistance*115.-wt*.7)*exp(-ringDistance*38.);
      inkDelta.y+=ring*.00065*water*uBoatStrength;
    }
  }
  vec2 sandDelta=vec2(0.);float sandGrainLight=0.;
  if(uSandWidth>.0001){
    vec2 top=uSandColumn.xy,bottom=uSandColumn.zw,axis=bottom-top;
    float along=dot(p-top,axis)/max(dot(axis,axis),.0001);
    float center=mix(top.x,bottom.x,clamp(along,0.,1.));
    float radius=uSandWidth*.5*(mix(.14,.45,uFlowWaterfall)+mix(.86,.55,uFlowWaterfall)*smoothstep(.0,.82,along));
    float edge=1.-smoothstep(radius*.35,radius,abs(p.x-center));
    float endFade=smoothstep(.045,.13,along)*(1.-smoothstep(.87,1.,along));
    float sandMask=edge*endFade;
    if(uScene>7.5 && uScene<8.5)sandMask*=smoothstep(.34,.36,p.y);
    if(uFlowWaterfall>.5)sandMask*=smoothstep(.40,.72,dot(color,vec3(.299,.587,.114)));
    if(sandMask>.001){
      // Fine grains descend through a stable column. Neither the stone aperture
      // nor ground is displaced, and no sine-wave water motion is used here.
      float grains=noise(vec2((p.x-center)*550.,p.y*120.-wt*14.));
      float fine=noise(vec2((p.x-center)*950.+13.,p.y*230.-wt*27.));
      sandDelta.y=(grains-.5)*.0025*sandMask*uMotion.z*uBoatStrength;
      sandDelta.x=(fine-.5)*.0006*sandMask*uMotion.z*uBoatStrength;
      float stream=.5+.5*sin(along*42.-wt*8.+noise(vec2(p.x*900.,0.))*2.);
      sandGrainLight=((fine-.5)*.12-(stream-.5)*.23)*sandMask*uBoatStrength/(1.+.35*uBoatStrength);
    }
  }
  vec2 vortexDelta=vec2(0.);
  if(uSkyVortex.w>.00001){
    float aspect=uImageSize.x/uImageSize.y;
    vec2 q=p;
    for(int j=0;j<4;j++){
      vec2 d=(q-uSkyVortex.xy)*vec2(aspect,1.);
      float radius=length(d);
      float moonPin=smoothstep(.06,.12,radius);
      float outerFade=1.-smoothstep(uSkyVortex.z*.65,uSkyVortex.z,radius);
      float horizonPin=1.-smoothstep(max(.10,uSkyBottom-.18),min(.50,uSkyBottom),q.y);
      float edgePin=smoothstep(0.,.14,q.x)*(1.-smoothstep(.86,1.,q.x))*smoothstep(0.,.12,q.y);
      float angle=sin(ct*.23)*uSkyVortex.w*2.25*uMotion.y*moonPin*outerFade*horizonPin*edgePin;
      float c=cos(angle),sn=sin(angle);
      q=uSkyVortex.xy+vec2(d.x*c-d.y*sn,d.x*sn+d.y*c)/vec2(aspect,1.);
    }
    vortexDelta=q-p;
  }
  vec2 focalDelta=vec2(0.);
  if(uScene>4.5 && uScene<5.5){
    float cloudMask=max(smoothstep(.80,.85,p.y),smoothstep(.62,.69,p.y)*(1.-smoothstep(.18,.24,p.x)));
    float edge=smoothstep(0.,.045,p.x)*(1.-smoothstep(.955,1.,p.x));
    focalDelta.x=sin(ct*.17+p.y*3.)*.024*cloudMask*edge;
  }
  if(uScene>9.5 && uScene<10.5){
    float curve=.80-.10*p.x-.70*p.x*p.x;
    float gas=exp(-pow((p.y-curve)/.17,2.));
    float core=smoothstep(.045,.16,length((p-vec2(.764,.371))*vec2(1.,.75)));
    float bounds=smoothstep(0.,.12,p.x)*(1.-smoothstep(.88,1.,p.x))*smoothstep(0.,.12,p.y)*(1.-smoothstep(.88,1.,p.y));
    focalDelta=vec2(sin(ct*.34)*.024,-cos(ct*.28)*.014)*gas*bounds*core;
  }
  if(uScene>14.5){
    // One continuous foreground deformation carries flowers and surrounding
    // leaves together. No source-color threshold splits a white petal edge.
    float leaf=(1.-smoothstep(.31,.44,p.x))*smoothstep(.13,.23,p.y)
      *(1.-smoothstep(.91,1.,p.y))*smoothstep(0.,.05,p.x);
    float flex=uWind/(1.+.45*uWind);
    focalDelta.x=sin(ft*.9-p.y*3.)*.0055*leaf*flex;
    focalDelta.y=cos(ft*.73+p.x*5.)*.0025*leaf*flex;
  }
  vec3 stationaryColor=color;
  color=texture2D(uImage,clamp(p+waterDelta+cloudDelta+sandDelta+vortexDelta+boatDelta+inkDelta+focalDelta,.001,.999)).rgb;
  if(uCoastal>.5 && uProtectWarm>.5){
    float sampledLuma=dot(color,vec3(.299,.587,.114));
    float safeSample=smoothstep(-.02,.09,color.b-color.r)*smoothstep(.07,.25,sampledLuma);
    color=mix(stationaryColor,color,safeSample);
  }
  color+=mix(vec3(.85,.55,.31),vec3(.78,.83,.82),uFlowWaterfall)*sandGrainLight;
  if(uInkFlow>.5){
    vec2 base=uSandColumn.zw+vec2(0.,.016);
    vec2 hazeCenter=base+vec2(sin(wt*.65)*.012,-.002+sin(wt*.18)*.0015);
    vec2 d=(p-hazeCenter)/vec2(.048,.025);
    float haze=exp(-dot(d,d)*1.5)*( .45+.55*noise(p*vec2(43.,37.)+vec2(-wt*.12,wt*.05)) );
    float alpha=haze*.18*(.8+.2*sin(wt*.21));
    color=mix(color,vec3(.84,.84,.79),alpha);
  }
  float luminance=dot(color,vec3(.299,.587,.114));
  if(water>.001 && uWater>.001 && uPrintWave<.5 && uPixel<.5 && uCoastal<.5){
  float highlights=pow(max(0.,sin(p.y*760.-wt*1.3+sin(p.x*34.+wt*.17)*2.)),15.);
  color+=uTint*highlights*smoothstep(.45,.88,luminance)*water*.05*waterDrive+rippleLight*uTint;
  }
  if(uCoastal>.5 && water>.01 && uWater>.001){
    float foam=smoothstep(.50,.79,luminance)*water;
    float arrival=.5+.5*sin(p.x*11.+p.y*8.-wt*.45-.6);
    float foamStrength=uWater/(1.+.5*uWater);
    color*=1.-foam*(1.-arrival)*.08*foamStrength;
    color+=(vec3(1.)-color)*foam*smoothstep(.60,.95,arrival)*.09*foamStrength;
  }
  // Sparse three-frame pixel splashes end falling rain on the puddle mask.
  // They are discrete short highlights rather than smooth expanding circles.
  if(uPixel>.5 && uEffectsB.y>.5 && water>.05){
    vec2 gridP=floor(p*vec2(420.,236.))/vec2(420.,236.);
    vec2 splashCell=floor(gridP*vec2(70.,38.));
    vec2 local=fract(gridP*vec2(70.,38.))-.5;
    float seed=hash(splashCell+vec2(14.,3.));
    float frame=mod(floor(wt*2.6+seed*16.),16.);
    if(seed>.91 && frame<3.){
      float radius=.03+frame*.11;
      float mark=(1.-step(.10,abs(abs(local.x)-radius)))*(1.-step(.10,abs(local.y)));
      color+=vec3(.31,.48,.61)*mark*(.20-frame*.045)*water*uBoatStrength;
    }
  }
  // Cloud wisps are independent textures. No artwork UV displacement crosses a tree.
  if(uEffectsA.x>.5 && uCloud>.001){
  float skyFade=(1.-smoothstep(max(.02,uSkyBottom-.12),uSkyBottom,p.y))*smoothstep(0.,.035,p.y);
  vec2 c1=vec2(fract(p.x*.67-uCloudTime*.018),clamp(p.y/max(uSkyBottom,.01),0.,1.));
  vec2 c2=vec2(fract(p.x*.91-uCloudTime*.010+.31),clamp(p.y/max(uSkyBottom,.01)*1.25-.17,0.,1.));
  float cloudField=texture2D(uCloudTexture,c1).r*.65+texture2D(uCloudTexture,c2).r*.35;
  color=mix(color,mix(vec3(.89,.9,.88),uTint,.22),cloudField*skyFade*smoothstep(.22,.65,luminance)*.19*uCloud*(.88+.12*localWind));
  }
  // Low atmospheric ribbons use texture translation, not global tint cycling.
  if(uEffectsA.y>.5){
    if(uInkFlow>.5){
      float valley=exp(-pow((p.y-(.675+.025*sin(p.x*5.)))/.045,2.));
      float pale=smoothstep(.48,.77,luminance);
      float wisp=noise(vec2(p.x*12.-ct*.60,p.y*55.))*noise(vec2(p.x*25.-ct*1.25,p.y*31.));
      float fringe=smoothstep(.12,.32,wisp);
      color=mix(color,vec3(.66,.69,.65),valley*pale*fringe*.20*uCloud/(1.+.4*uCloud));
      color=mix(color,vec3(.94,.92,.86),valley*pale*(1.-fringe)*.18*uCloud/(1.+.4*uCloud));
    }else{
      float mist=exp(-pow((p.y-uSkyBottom-.13-sin(p.x*8.+ct*.21)*.07)*18.,2.));
      float mistNoise=noise(vec2(p.x*8.-ct*.07,p.y*24.));
      color=mix(color,vec3(.79,.85,.83),mist*mistNoise*.17*uCloud);
    }
  }
  // Existing starlight breathes; the deep-space overlay also has a slow drift.
  if(uEffectsA.z>.5){
  vec2 starPosition=p-vec2(ct*.0022,ct*.0007)*step(9.5,uScene)*step(uScene,10.5);
  vec2 starGrid=starPosition*vec2(200.,112.5),starCell=floor(starGrid),starLocal=fract(starGrid)-.5;
  float starSeed=hash(starCell),starDot=exp(-dot(starLocal,starLocal)*150.);
  float star=step(.988,starSeed)*starDot*(.45+.35*sin(lt*.6+starSeed*71.));
  // Added star points and source lighting have different spatial fields.
  // The oil moon is excluded from both; no discrete cell can light its face.
  bool oilNight=uScene>.5 && uScene<1.5;
  float moonGuard=1.;
  if(oilNight)moonGuard=smoothstep(.085,.15,length((p-uSkyVortex.xy)*vec2(uImageSize.x/uImageSize.y,1.)));
  vec3 starAddition=vec3(.7,.84,1.)*star*uEffectsA.z*(1.-smoothstep(.35,.82,p.y))*.30*uLight;
  if(oilNight){
    float shoulder=1.-smoothstep(.86,.98,luminance);
    color+=min(starAddition*moonGuard*shoulder,(vec3(1.)-color)*.40);
  }else color+=starAddition;
  float sourceStarPhase=starSeed*17.;
  if(oilNight || (uScene>9.5 && uScene<10.5))sourceStarPhase=p.x*7.+p.y*5.+noise(p*3.)*2.;
  float coreGuard=(uScene>9.5 && uScene<10.5)?(1.-smoothstep(.91,.99,luminance)):1.;
  if(oilNight)coreGuard=moonGuard*(1.-smoothstep(.91,.99,luminance));
  color*=1.+pow(smoothstep(.65,.98,luminance),3.)*sin(lt*.52+sourceStarPhase)*.10*uLight*coreGuard;
  }
  // Arctic curtains: slow coherent bands, not full-image hue cycling.
  if(uEffectsA.w>.5){
  float curtain=0.;
  for(int j=0;j<3;j++){float f=float(j);float edge=.21+sin(p.x*5.2+ct*.31+f*.7)*.055+f*.055;curtain+=exp(-abs(p.y-edge)*28.)*(.5+.5*noise(vec2(p.x*34.-ct*.31,f*4.)))*(.8-f*.19);}
  vec3 auroraColor=mix(vec3(.15,.75,.54),vec3(.45,.25,.78),.5+.5*sin(p.x*3.+ct*.21));
  color+=curtain*auroraColor*.25*uEffectsA.w*uLight*(1.-smoothstep(.38,.53,p.y));
  }
  // Snow uses two depth scales with coherent wind. Rain uses slanted long strokes.
  if(uEffectsB.x>.5 || uEffectsB.y>.5){
  for(int j=0;j<2;j++){
    float layer=float(j);
    if(uEffectsB.x>.5){
    float speed=.027+layer*.024;
    vec2 snowCoord=vec2(p.x+sin(wt*.21)*.008*uWind,p.y-wt*speed)*vec2(39.+layer*27.,25.+layer*15.);
    vec2 cell=floor(snowCoord),local=fract(snowCoord)-.5;
    float seed=hash(cell+layer*20.);
    float flake=exp(-dot(local,local)*(210.+layer*200.))*step(.79,seed);
    color+=vec3(.8,.9,1.)*flake*(.33-layer*.08)*uBoatStrength;
    }
    if(uEffectsB.y>.5){
    vec2 rainP=uPixel>.5?floor(p*vec2(420.,236.))/vec2(420.,236.):p;
    float rainTime=uPixel>.5?floor(wt*9.)/9.:wt;
    vec2 rainUV=vec2(rainP.x+rainP.y*.09*uWind,rainP.y-rainTime*(.9+layer*.38))*vec2(140.+layer*60.,11.+layer*8.);
    vec2 rc=floor(rainUV),rl=fract(rainUV)-.5;
    float rain=exp(-rl.x*rl.x*2000.)*(1.-smoothstep(.05,.48,abs(rl.y)))*step(.85,hash(rc));
    if(uPixel>.5)rain=step(abs(rl.x),.15)*step(abs(rl.y),.37)*step(.85,hash(rc));
    color+=vec3(.5,.65,.8)*rain*(.28+layer*.07)*uBoatStrength;
    }
  }
  }
  // The underwater light field follows the photographed opening, not a set
  // of evenly spaced artificial columns. Only luminance changes; reefs,
  // seagrass, fish and sand geometry retain their original source coordinates.
  if(uEffectsB.z>.5 && uLight>.001){
    float lightTime=lt*.9;
    vec2 fromOpening=(p-vec2(.54,.05))*vec2(uImageSize.x/uImageSize.y,1.);
    float angle=atan(fromOpening.x,max(fromOpening.y,.001));
    float fan=1.-smoothstep(.35,.78,abs(angle));
    float depthFade=smoothstep(.08,.19,p.y)*(1.-smoothstep(.65,.86,p.y));
    float cold=smoothstep(.04,.20,color.b-color.r);
    float clearWater=smoothstep(.14,.40,luminance)*cold;
    float breath=.24*(.65*sin(lightTime+angle*4.5)
      +.35*sin(lightTime*.61-angle*8.+.4));
    float illumination=breath*fan*depthFade*clearWater*uLight;
    color+=min(color*max(illumination,0.),(vec3(1.)-color)*.38);
    color*=1.+min(illumination,0.);
    // Existing bright caustic tracery rises and falls as the same light field
    // crosses the bed. A faint irregular filament adds optical travel, not fog.
    float bed=smoothstep(.66,.80,p.y)*smoothstep(.24,.57,luminance)
      *smoothstep(.05,.15,p.x)*(1.-smoothstep(.78,.94,p.x));
    float tracery=smoothstep(.44,.79,luminance)*bed;
    float wave=sin(p.x*16.+p.y*9.-lightTime+sin(p.y*11.+lightTime*.61));
    float traceLift=tracery*wave*.16*uLight;
    color+=min(color*max(traceLift,0.),(vec3(1.)-color)*.30);
    color*=1.+min(traceLift,0.);
    vec2 cu=p*vec2(13.,10.);
    float filament=pow(abs(sin(cu.x+lightTime*.68+sin(cu.y+lightTime*.47))
      *sin(cu.y-lightTime*.58+sin(cu.x))),12.);
    color+=min(vec3(.055,.085,.088)*filament*bed*uLight,(vec3(1.)-color)*.18);
  }
  // Paper edge depth is measured from the static source; a moving studio beam
  // reveals successive layers without displacing any cut edge.
  if(uEffectsB.w>.5){
    float beam=exp(-pow((p.x-(.5+.42*sin(lt*.32)))/.20,2.));
    vec3 ahead=texture2D(uImage,clamp(p+vec2(.0025,.0015),.001,.999)).rgb;
    float edge=clamp(length(color-ahead)*3.,0.,1.);
    float depth=.3+.7*smoothstep(.12,.72,luminance);
    color*=1.+((beam-.35)*.17*depth+edge*(beam-.5)*.22)*uLight;
    color+=uTint*beam*edge*.035*uLight;
  }
  // Emissive surfaces receive a traveling light band and a soft pulse.
  if(uEffectsC.x>.5){
    float emissive=smoothstep(.25,.65,luminance);
    bool rainPort=uScene>5.5 && uScene<6.5;
    float neonTime=rainPort?wt:lt;
    float neonStrength=rainPort?uBoatStrength:uLight;
    float scan=exp(-pow((fract(p.y*.75-neonTime*.12)-.5)*9.,2.));
    color*=1.+(sin(neonTime*1.1)*.035+scan*.18)*emissive*neonStrength;
  }
  if(uEffectsC.z>.5 && uLight>.001){
    // A broad ten-second studio light travels around the rigid ceramic surface.
    // Warm source color isolates the object from the cool lavender background;
    // no source UV, geometry, or baked shadow position is displaced.
    float surface=smoothstep(.02,.10,color.r-color.b)
      *smoothstep(.30,.37,p.x)*(1.-smoothstep(.89,.97,p.y));
    float phase=lt*.62;
    vec2 lightCenter=vec2(.66+.21*cos(phase),.43+.26*sin(phase));
    vec2 ellipse=(p-lightCenter)/vec2(.24,.18);
    float beam=exp(-dot(ellipse,ellipse)*1.15);
    float lift=.34*beam*surface*uLight;
    // Highlight shoulder preserves ivory texture instead of clipping to white.
    color+=min(color*lift,(vec3(1.)-color)*.65);
    color*=1.-surface*(1.-beam)*(.006+.006*sin(phase-.7))*uLight;
    float contact=exp(-pow((p.x-.69)/.23,2.)-pow((p.y-.825)/.035,2.))
      *(1.-smoothstep(.30,.55,luminance));
    float shadowPulse=.5+.5*cos(phase-1.1);
    color*=1.-contact*shadowPulse*.09*uLight;
  }
  // Heat shimmer applies to air light only, not the source architecture or rocks.
  if(uEffectsC.y>.5)color+=uTint*noise(vec2(p.x*5.-ft*.12,p.y*12.))*exp(-pow((p.y-.57)*15.,2.))*.038*uEffectsC.y*uWind;
  float vignette=1.-.055*pow(length((screen-.5)*1.4),2.);
  gl_FragColor=vec4(max(color*vignette,0.),1.);
}`;
const SPRITE_VERTEX=`attribute vec2 aPosition;uniform vec4 uRect;uniform vec2 uPivot;uniform float uAngle,uAspect;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;vec2 pixel=uRect.xy+vUv*uRect.zw;vec2 d=(pixel-uPivot)*vec2(uAspect,1.);float c=cos(uAngle),s=sin(uAngle);vec2 pos=uPivot+vec2(d.x*c-d.y*s,d.x*s+d.y*c)/vec2(uAspect,1.);gl_Position=vec4(pos.x*2.-1.,1.-pos.y*2.,0.,1.);}`;
const SPRITE_FRAGMENT=`precision highp float;
varying vec2 vUv;
uniform sampler2D uSprite;
uniform vec2 uFlexPivot;
uniform float uOpacity,uFlexTime,uFlexWind,uFlexGust,uFlex,uBaseFade;
void main(){
  vec2 uv=vUv;
  // A smooth, low-amplitude bend acts only on this transparent sprite.
  // The root is exactly fixed; higher foliage lags the lower branches slightly.
  float distanceFromRoot=length((vUv-uFlexPivot)*vec2(.85,1.));
  float crown=pow(clamp(distanceFromRoot,0.,1.),1.7);
  float phase=uFlexTime*.73-vUv.y*1.1;
  float bend=(sin(phase)*.72+sin(uFlexTime*1.17-vUv.y*1.8+.8)*.28);
  uv.x+=clamp(bend*uFlex*uFlexWind*uFlexGust,-.045,.045)*crown;
  uv.y+=sin(phase*.81)*uFlex*.15*uFlexWind*crown;
  vec4 c=texture2D(uSprite,clamp(uv,0.,1.));
  float base=1.;
  if(uBaseFade>.001)base=1.-smoothstep(1.-uBaseFade,1.,vUv.y);
  gl_FragColor=vec4(c.rgb,c.a*uOpacity*base);
}`;

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hashString=s=>[...s].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,2166136261);
function seeded(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function rgb(color,fallback=[1,.87,.65]){if(!color||!/^#[\da-f]{6}$/i.test(color))return fallback;return [1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255);}
function normalizeScene(scene){
  if(!scene||!scene.image)throw new Error('Wallpaper scene requires an image path.');
  const effects=Array.isArray(scene.effects)?scene.effects:[];
  return {...scene,id:scene.id||scene.image,style:scene.style||'landscape',effects,fit:scene.fit||'contain',focus:scene.focus||[.5,.5],sky:scene.sky||{bottom:.42},foreground:scene.foreground||[]};
}
function imageLoad(src){return new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Artwork failed to load: ${src}`));image.src=src;});}
function cloudCanvas(){
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d'),random=seeded(92781);
  ctx.fillStyle='black';ctx.fillRect(0,0,c.width,c.height);
  // Seamlessly tiled, low-frequency puff field, feathered above and below.
  for(let i=0;i<70;i++){let x=random()*512,y=20+random()*88,rx=30+random()*70,ry=4+random()*15;for(const offset of [-512,0,512]){ctx.save();ctx.translate(x+offset,y);ctx.scale(rx,ry);const gradient=ctx.createRadialGradient(0,0,0,0,0,1);gradient.addColorStop(0,`rgba(255,255,255,${.08+random()*.15})`);gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(-1,-1,2,2);ctx.restore();}}
  return c;
}
function makeMask(scene){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=576;const ctx=canvas.getContext('2d');ctx.fillStyle='black';ctx.fillRect(0,0,1024,576);
  const polygons=scene.water?.polygons||(scene.water?.polygon?[scene.water.polygon]:[]);
  if(polygons.length){ctx.fillStyle='white';for(const polygon of polygons){ctx.beginPath();polygon.forEach(([x,y],i)=>i?ctx.lineTo(x*1024,y*576):ctx.moveTo(x*1024,y*576));ctx.closePath();ctx.fill();}ctx.globalCompositeOperation='destination-out';ctx.lineJoin='round';ctx.lineWidth=11;ctx.strokeStyle='black';for(const polygon of polygons){ctx.beginPath();polygon.forEach(([x,y],i)=>i?ctx.lineTo(x*1024,y*576):ctx.moveTo(x*1024,y*576));ctx.closePath();ctx.stroke();}ctx.globalCompositeOperation='source-over';}
  // Explicit inner islands/rock platforms remain static even inside a broad sea polygon.
  for(const polygon of scene.water?.excludePolygons||[]){ctx.fillStyle='black';ctx.beginPath();polygon.forEach(([x,y],i)=>i?ctx.lineTo(x*1024,y*576):ctx.moveTo(x*1024,y*576));ctx.closePath();ctx.fill();ctx.strokeStyle='black';ctx.lineWidth=7;ctx.stroke();}
  // Blur and threshold create a water-only feather instead of bleeding on shore.
  const soft=document.createElement('canvas');soft.width=1024;soft.height=576;const sc=soft.getContext('2d');sc.fillStyle='black';sc.fillRect(0,0,1024,576);sc.filter='blur(3px)';sc.drawImage(canvas,0,0);return soft;
}

export async function createWallpaperEngine(canvas, initialScene, options={}){
  if(!(canvas instanceof HTMLCanvasElement))throw new TypeError('A canvas element is required.');
  const settings={wind:1,water:1,cloud:1,light:1,volume:.35,motion:true,speed:1};
  let scene=normalizeScene(initialScene),image,foreground=[],disposed=false,playing=true,raf=0,time=0,cloudTime=0,waterTime=0,windTime=0,lightTime=0,userMotionOverride=false,last=0,frameCount=0,qualityScale=1,loadVersion=0;
  let width=1,height=1,metricsStart=performance.now(),metricsFrames=0,fps=0,frameMs=0,lastQualityCheck=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),listeners=[];
  const ripples=new Float32Array([0,0,-100,0,0,-100,0,0,-100,0,0,-100]);let rippleIndex=0;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
  if(!gl){options.onError?.(new Error('WebGL unavailable. Static artwork fallback is active.'));return createStaticFallback(canvas,scene,options);}
  let program,spriteProgram,quad,artTexture,maskTexture,cloudTexture,uniforms,spriteUniforms;
  const textures=new Set(),shaders=new Set(),programs=new Set();
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(log);}shaders.add(shader);return shader;}
  function createProgram(vertex,fragment){const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));programs.add(p);return p;}
  function texture(source){const t=gl.createTexture();textures.add(t);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
  function deleteTexture(t){if(t){gl.deleteTexture(t);textures.delete(t);}}
  function init(){
    program=createProgram(VERTEX,FRAGMENT);spriteProgram=createProgram(SPRITE_VERTEX,SPRITE_FRAGMENT);
    quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    uniforms=Object.fromEntries(['uImage','uWaterMask','uCloudTexture','uResolution','uImageSize','uFocus','uTime','uCloudTime','uWind','uWater','uCloud','uLight','uFit','uSkyBottom','uGust','uCloudAdvection','uPixel','uHasWater','uWindFront','uEffectsA','uEffectsB','uEffectsC','uSandColumn','uSkyVortex','uSkyRegion','uSkyProtect','uClocks','uMotion','uScene','uBoat','uSandWidth','uFlowWaterfall','uPrintWave','uCoastal','uProtectWarm','uInkFlow','uBoatStrength','uTint','uRipples[0]'].map(n=>[n,gl.getUniformLocation(program,n)]));
    spriteUniforms=Object.fromEntries(['uRect','uPivot','uAngle','uAspect','uSprite','uOpacity','uFlexTime','uFlexWind','uFlexGust','uFlex','uBaseFade','uFlexPivot'].map(n=>[n,gl.getUniformLocation(spriteProgram,n)]));
    cloudTexture=texture(cloudCanvas());
  }
  init();
  const overlay=document.createElement('canvas');overlay.setAttribute('aria-hidden','true');overlay.className='wallpaper-atmosphere';Object.assign(overlay.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none'});canvas.after(overlay);const painter=overlay.getContext('2d');
  let particles=[],sandGrains=[];
  function configureParticles(){
    const rng=seeded(hashString(scene.id));particles=Array.from({length:48},()=>({x:rng(),y:rng(),size:.6+rng()*1.2,speed:.006+rng()*.01,phase:rng()*Math.PI*2,depth:.4+rng()*.6}));
    sandGrains=[];
    if(scene.style==='desert'){
      const ridges=scene.sandRidges||[
        [[.70,.285],[.70,.33],[.66,.36],[.59,.38],[.55,.44],[.55,.49],[.57,.55],[.61,.63],[.68,.74],[.76,.87],[.83,1]],
        [[.43,.31],[.425,.34],[.41,.36],[.37,.37],[.36,.39]],
        [[.205,.38],[.20,.40],[.18,.42],[.15,.44]],
      ];
      for(let r=0;r<ridges.length;r++){
        const points=ridges[r].points||ridges[r],segments=[];let total=0;
        for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot((b[0]-a[0])*1.777,b[1]-a[1]);segments.push({a,b,start:total,length});total+=length;}
        const count=r===0?76:18;
        for(let i=0;i<count;i++){const distance=rng()*total,segment=segments.find(s=>distance<=s.start+s.length)||segments.at(-1);if(!segment)continue;const f=(distance-segment.start)/Math.max(segment.length,.0001);sandGrains.push({x:segment.a[0]+(segment.b[0]-segment.a[0])*f,y:segment.a[1]+(segment.b[1]-segment.a[1])*f,phase:rng(),speed:.075+rng()*.08,spread:.65+rng()*.35,scale:.5+rng()*.5,ridge:r});}
      }
    }
  }
  async function load(next){
    const version=++loadVersion,normalized=normalizeScene(next);
    const [newImage,...newForeground]=await Promise.all([imageLoad(normalized.image),...normalized.foreground.map(f=>imageLoad(f.image))]);
    if(disposed||version!==loadVersion)return;
    deleteTexture(artTexture);deleteTexture(maskTexture);foreground.forEach(f=>deleteTexture(f.texture));
    scene=normalized;image=newImage;artTexture=texture(image);maskTexture=texture(makeMask(scene));foreground=newForeground.map((img,i)=>({...scene.foreground[i],source:img,texture:texture(img),rotation:scene.foreground[i].rotation||0}));
    time=0;cloudTime=0;waterTime=0;windTime=0;lightTime=0;ripples.fill(0);for(let i=0;i<4;i++)ripples[i*3+2]=-100;configureParticles();resize();invalidate();
  }
  function running(){return playing&&settings.motion&&(!reduced.matches||userMotionOverride)&&!document.hidden&&!disposed;}
  function resize(){if(disposed)return;const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);const ratio=Math.min(devicePixelRatio||1,options.maxDpr||1.75,(options.maxResolution||3840)/Math.max(width,height))*qualityScale;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);overlay.width=canvas.width;overlay.height=canvas.height;gl.viewport(0,0,canvas.width,canvas.height);invalidate();}
  function bindQuad(p){gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,quad);const position=gl.getAttribLocation(p,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);}
  function bindTexture(t,unit,location){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.uniform1i(location,unit);}
  function getTransform(w=canvas.width,h=canvas.height){const ratio=scene.fit==='cover'?Math.max(w/image.width,h/image.height):Math.min(w/image.width,h/image.height);return {scale:ratio,x:w*.5-image.width*ratio*scene.focus[0],y:h*.5-image.height*ratio*scene.focus[1],width:image.width*ratio,height:image.height*ratio};}
  function paintParticles(gust){
    painter.clearRect(0,0,overlay.width,overlay.height);const {x,y,width:iw,height:ih}=getTransform(),fx=new Set(scene.effects);painter.save();painter.beginPath();painter.rect(x,y,iw,ih);painter.clip();
    const fire=fx.has('fireflies'),petals=fx.has('petals'),dust=fx.has('dust')&&scene.style!=='desert',embers=fx.has('embers'),bubbles=fx.has('bubbles');
    const profile=motionProfile(scene);
    if(fire||petals||dust||embers||bubbles){
      for(let i=0;i<particles.length;i++){
        const p=particles[i],isFire=fire&&(!petals||i<30),isPetal=petals&&!isFire;
        const clock=bubbles?waterTime:(scene.style==='surreal'&&dust?cloudTime:windTime);
        let px=(p.x+clock*p.speed*.42*profile.particle)%1;
        let py=(p.y-clock*p.speed*(bubbles?1.5:.3)*profile.particle+100)%1;
        px+=Math.sin(clock*.7+p.phase)*.016;
        if(isFire){px=p.x*.90+.05+Math.sin(clock*.42+p.phase)*.035+Math.sin(clock*.91+p.phase)*.009;py=.57+p.y*.36+Math.cos(clock*.38+p.phase)*.022;}
        if(isPetal)py=(p.y+clock*p.speed*.8*profile.particle)%1;
        const size=p.size*Math.max(.8,overlay.width/1600)*(isFire?1.5:1);
        const alive=.25+.75*Math.pow(.5+.5*Math.sin(lightTime*1.2+p.phase),2.);
        const alpha=isFire?alive*.8:.22+p.depth*.17;
        const sx=x+px*iw,sy=y+py*ih;
        painter.save();painter.translate(sx,sy);painter.globalAlpha=alpha;
        if(isPetal){painter.rotate(clock*.8+p.phase);painter.fillStyle=scene.petalColor||'#eab5c6';painter.beginPath();painter.ellipse(0,0,size*2,size*.8,0,0,Math.PI*2);painter.fill();}
        else if(bubbles){painter.strokeStyle='#cfefee';painter.lineWidth=Math.max(.7,size*.45);painter.beginPath();painter.arc(0,0,size*2.5,0,Math.PI*2);painter.stroke();painter.fillStyle='#e7fcff';painter.beginPath();painter.arc(-size*.7,-size*.8,size*.5,0,Math.PI*2);painter.fill();}
        else{
          painter.fillStyle=isFire?'#fff2b2':embers?'#f6b378':'#efe2bf';
          if(isFire){
            painter.shadowBlur=size*7;painter.shadowColor='#f6ce73';
            // A short fading trace follows the actual looping flight path.
            painter.strokeStyle='#ecd493';painter.lineWidth=size*.65;painter.globalAlpha=alpha*.33;painter.beginPath();
            for(let k=0;k<7;k++){const q=clock-k*.045;const tx=(p.x*.90+.05+Math.sin(q*.42+p.phase)*.035+Math.sin(q*.91+p.phase)*.009-px)*iw;const ty=(.57+p.y*.36+Math.cos(q*.38+p.phase)*.022-py)*ih;k?painter.lineTo(tx,ty):painter.moveTo(tx,ty);}painter.stroke();painter.globalAlpha=alpha;
          }
          painter.beginPath();painter.arc(0,0,size,0,Math.PI*2);painter.fill();
        }
        painter.restore();
      }
    }
    const flow=scene.flowColumn||scene.sandColumn;
    if(flow && (scene.style==='ink'||scene.style==='surreal')){
      const waterfall=flow.kind==='waterfall',rng=seeded(hashString(scene.id)+922),raw=settings.water;
      const start=flow.top,end=flow.bottom;
      for(let i=0;i<(waterfall?58:110);i++){
        const seed=rng(),lane=rng()-.5,phase=rng(),speed=.24+rng()*.20;
        const age=(waterTime*speed+phase)%1;
        const along=(waterfall?.08:.18)+age*(waterfall?.83:.73);
        const radius=flow.width*(waterfall?.24:(.13+.38*along));
        const px=start[0]+(end[0]-start[0])*along+lane*radius;
        const py=start[1]+(end[1]-start[1])*along;
        const fade=Math.sin(age*Math.PI)*Math.min(raw,1.5);
        const length=(waterfall?.005:.0035)*(1.+seed);
        painter.strokeStyle=waterfall?(i%3===0?`rgba(126,136,125,${fade*.40})`:`rgba(248,246,230,${fade*.75})`):`rgba(221,155,98,${fade*.72})`;
        painter.lineWidth=Math.max(.65,iw*(waterfall?.00065:.0006));
        painter.beginPath();painter.moveTo(x+px*iw,y+py*ih);painter.lineTo(x+(px+lane*.0006)*iw,y+(py-length)*ih);painter.stroke();
      }
      for(let i=0;i<14;i++){
        const seed=rng(),phase=rng(),side=i%2?1:-1;
        const age=(waterTime*(.22+seed*.10)+phase)%1;
        const drift=age*(waterfall?.038:.066)*side;
        const px=end[0]+drift,py=end[1]-(waterfall?.003:.015)-Math.sin(age*Math.PI)*(waterfall?.012:.020);
        const rx=(waterfall?.014:.024)+age*(waterfall?.020:.035),ry=(waterfall?.005:.009)+age*.008;
        const alpha=Math.sin(age*Math.PI)*(.12+seed*.10)*Math.min(raw,1.7);
        painter.save();painter.translate(x+px*iw,y+py*ih);painter.scale(rx*iw,ry*ih);
        const gradient=painter.createRadialGradient(0,0,0,0,0,1);
        gradient.addColorStop(0,waterfall?`rgba(215,216,201,${alpha})`:`rgba(200,135,87,${alpha})`);
        gradient.addColorStop(1,waterfall?'rgba(215,216,201,0)':'rgba(200,135,87,0)');
        painter.fillStyle=gradient;painter.fillRect(-1,-1,2,2);painter.restore();
      }
    }
    if(scene.style==='desert'&&settings.wind>.001){
      // Sand is emitted only from surveyed dune crests, never the open sky.
      // The dark lee side lies to the right of these paths in this artwork.
      const wind=settings.wind,pixel=iw/1672;
      for(let i=0;i<sandGrains.length;i+=3){
        const grain=sandGrains[i],near=clamp((grain.y-.28)/.72,0.,1.);
        const age=(windTime*(.16+grain.speed*.35)+grain.phase)%1;
        const drift=age*(.035+.060*near);
        const px=grain.x+drift,py=grain.y+drift*.20-Math.sin(age*Math.PI)*(.002+.004*near);
        const rx=(.018+.030*near)*(.7+age),ry=(.004+.008*near)*(.6+age*.7);
        const envelope=Math.pow(Math.sin(age*Math.PI),1.2);
        const opacity=envelope*(.22+.13*near)*wind/(1.+.35*wind);
        painter.save();painter.translate(x+px*iw,y+py*ih);painter.rotate(.08);painter.scale(rx*iw,ry*ih);
        const veil=painter.createRadialGradient(-.25,0,.02,0,0,1);
        veil.addColorStop(0,`rgba(226,194,148,${opacity})`);veil.addColorStop(.45,`rgba(211,177,128,${opacity*.65})`);veil.addColorStop(1,'rgba(211,177,128,0)');
        painter.fillStyle=veil;painter.beginPath();painter.moveTo(-1,0);painter.bezierCurveTo(-.65,-.9,.05,-.65,.90,-.25);painter.bezierCurveTo(1,.15,.2,.8,-.65,.35);painter.closePath();painter.fill();painter.restore();
      }
      for(let i=0;i<sandGrains.length;i++){
        const grain=sandGrains[i],near=clamp((grain.y-.28)/.72,0.,1.);
        const age=(windTime*grain.speed*profile.particle+grain.phase)%1;
        const travel=Math.min(.075,age*(.015+.05*near)*grain.spread*(.55+.45*wind));
        const px=grain.x+travel;
        const py=grain.y+travel*.23-Math.sin(age*Math.PI)*(.001+.003*near)*gust;
        const envelope=Math.pow(Math.sin(age*Math.PI),1.4);
        const alpha=envelope*(.16+.18*gust)*wind*grain.scale;
        painter.strokeStyle=`rgba(201,177,137,${alpha})`;
        painter.lineWidth=Math.max(.45,(.7+.8*near)*pixel);
        painter.lineCap='round';painter.beginPath();
        painter.moveTo(x+px*iw,y+py*ih);
        painter.lineTo(x+(px+.0014+.003*near)*iw,y+(py+.00025)*ih);painter.stroke();
        if(i%13===0){
          // A few broad, extremely thin veils connect the grains at the crest.
          const haze=.07*gust*wind*(.4+.6*envelope),rx=(.006+.009*near)*iw,ry=(.0015+.002*near)*ih;
          painter.save();painter.translate(x+(grain.x+travel*.5)*iw,y+(grain.y-.0008)*ih);painter.scale(rx,ry);
          const gradient=painter.createRadialGradient(.25,0,0,.25,0,1);gradient.addColorStop(0,`rgba(190,161,120,${haze})`);gradient.addColorStop(1,'rgba(190,161,120,0)');painter.fillStyle=gradient;painter.fillRect(-1,-1,2,2);painter.restore();
        }
      }
    }
    // Independent foreground reeds: only explicitly requested, anchored offscreen.
    if(fx.has('reeds')){const rng=seeded(hashString(scene.id)+13);for(let i=0;i<24;i++){const bx=rng()<.5?rng()*.11:.9+rng()*.1,by=1.035,len=.045+rng()*.09,lean=(rng()-.5)*.03+Math.sin(windTime*.95+i*.4)*.016*settings.wind*gust;painter.strokeStyle=i%3?'#344331b5':'#8a90635c';painter.lineWidth=Math.max(.7,iw*.0008);painter.beginPath();painter.moveTo(x+bx*iw,y+by*ih);painter.quadraticCurveTo(x+(bx+lean*.3)*iw,y+(by-len*.65)*ih,x+(bx+lean)*iw,y+(by-len)*ih);painter.stroke();}}
    painter.restore();
  }
  function draw(now=performance.now(),force=false){
    raf=0;if(disposed||gl.isContextLost()||!image||document.hidden&&!force)return;
    const cpuStart=performance.now(),delta=last?Math.min((now-last)/1000,.05):0;last=now;
    const active=running();const scaledDelta=delta*settings.speed;
    if(active&&!force){time+=scaledDelta;cloudTime+=scaledDelta*settings.cloud;waterTime+=scaledDelta*settings.water;windTime+=scaledDelta*settings.wind;lightTime+=scaledDelta*settings.light;}
    const profile=motionProfile(scene);
    const windFront=-.5+((windTime+7)%24)/24*2;
    const gust=.50+.14*Math.sin(windTime*.55)+.08*Math.sin(windTime*1.1+.6)+.06*Math.sin(windTime*.23+1.2)+.18*Math.exp(-Math.pow((windFront-.5)/.64,2));
    bindQuad(program);gl.disable(gl.BLEND);bindTexture(artTexture,0,uniforms.uImage);bindTexture(maskTexture,1,uniforms.uWaterMask);bindTexture(cloudTexture,2,uniforms.uCloudTexture);
    gl.uniform2f(uniforms.uResolution,canvas.width,canvas.height);gl.uniform2f(uniforms.uImageSize,image.width,image.height);gl.uniform2f(uniforms.uFocus,...scene.focus);
    for(const [key,value]of Object.entries({uTime:time,uCloudTime:cloudTime,uWind:settings.wind,uWater:settings.water*(scene.water?.strength??1),uCloud:settings.cloud,uLight:settings.light,uFit:scene.fit==='contain'?1:0,uSkyBottom:scene.sky?.bottom??.42,uGust:gust,uCloudAdvection:scene.sky?.advect?1:0,uPixel:scene.style==='pixel'?1:0,uHasWater:scene.water?.polygon||scene.water?.polygons?1:0,uWindFront:windFront}))gl.uniform1f(uniforms[key],value);
    gl.uniform4f(uniforms.uClocks,waterTime,windTime,lightTime,0);gl.uniform4f(uniforms.uMotion,profile.water,profile.cloud,profile.flow,profile.particle);gl.uniform1f(uniforms.uScene,parseInt(scene.id)||0);
    const region=scene.sky?.advectionRect||scene.sky?.advectRegion||[0,0,0,0];gl.uniform4f(uniforms.uSkyRegion,...region);gl.uniform3f(uniforms.uSkyProtect,...(scene.sky?.protectCircle||[.78,.22,.15]));const boat=scene.boat;gl.uniform4f(uniforms.uBoat,...(boat?.center||[0,0]),...(boat?.radii||[0,0]));gl.uniform1f(uniforms.uBoatStrength,settings.water);
    const vortex=scene.sky?.vortex;gl.uniform4f(uniforms.uSkyVortex,...(vortex?.center||[0,0]),vortex?.radius||0,vortex?.strength||0);
    const sand=scene.flowColumn||scene.sandColumn;gl.uniform4f(uniforms.uSandColumn,...(sand?.top||[0,0]),...(sand?.bottom||[0,1]));gl.uniform1f(uniforms.uSandWidth,sand?.width||0);gl.uniform1f(uniforms.uFlowWaterfall,sand?.kind==='waterfall'?1:0);gl.uniform1f(uniforms.uPrintWave,scene.style==='ukiyoe'?1:0);gl.uniform1f(uniforms.uCoastal,scene.style==='film'||scene.effects.includes('coastal')?1:0);gl.uniform1f(uniforms.uProtectWarm,scene.water?.protectWarm?1:0);gl.uniform1f(uniforms.uInkFlow,scene.style==='ink'&&sand?.kind==='waterfall'?1:0);
    const fx=new Set(scene.effects);gl.uniform4f(uniforms.uEffectsA,+fx.has('clouds'),+fx.has('mist'),+fx.has('stars'),+fx.has('aurora'));gl.uniform4f(uniforms.uEffectsB,+fx.has('snow'),+fx.has('rain'),+fx.has('caustics'),+fx.has('paper'));gl.uniform4f(uniforms.uEffectsC,+fx.has('neon'),+fx.has('heat'),+fx.has('glow'),0);
    gl.uniform3f(uniforms.uTint,...rgb(scene.lightColor||scene.palette?.[0]));gl.uniform3fv(uniforms['uRipples[0]'],ripples);gl.drawArrays(gl.TRIANGLES,0,6);
    if(foreground.length){bindQuad(spriteProgram);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);const tr=getTransform();gl.enable(gl.SCISSOR_TEST);gl.scissor(Math.max(0,tr.x),Math.max(0,canvas.height-tr.y-tr.height),Math.min(canvas.width,tr.width),Math.min(canvas.height,tr.height));for(const f of foreground){if(active&&!force&&f.rotationSpeed)f.rotation=(f.rotation+scaledDelta*f.rotationSpeed*profile.sprite*(.65+.35*gust)*settings.wind)%(Math.PI*2);const anchor=f.anchor||[.1,1],fw=(f.width||.3)*tr.width,fh=(f.height||(f.width||.3)*f.source.height/f.source.width*image.width/image.height)*tr.height;const root=[tr.x+anchor[0]*tr.width,tr.y+anchor[1]*tr.height];const x=root[0]-fw*(f.pivot?.[0]??.5),y=root[1]-fh*(f.pivot?.[1]??1);gl.uniform4f(spriteUniforms.uRect,x/canvas.width,y/canvas.height,fw/canvas.width,fh/canvas.height);gl.uniform2f(spriteUniforms.uPivot,root[0]/canvas.width,root[1]/canvas.height);gl.uniform1f(spriteUniforms.uAspect,canvas.width/canvas.height);gl.uniform1f(spriteUniforms.uAngle,f.rotation+(f.sway??.008)*profile.sprite*Math.sin(windTime*.8+(f.phase||0))*gust*settings.wind);gl.uniform1f(spriteUniforms.uOpacity,f.opacity??1);gl.uniform2f(spriteUniforms.uFlexPivot,...(f.pivot||[.5,1]));gl.uniform1f(spriteUniforms.uFlexTime,windTime+(f.phase||0));gl.uniform1f(spriteUniforms.uFlexWind,settings.wind);gl.uniform1f(spriteUniforms.uFlexGust,gust+.13*Math.exp(-Math.pow((anchor[0]-windFront)*4.2,2.)));gl.uniform1f(spriteUniforms.uFlex,(f.bend??f.elasticity??.005)*profile.sprite);gl.uniform1f(spriteUniforms.uBaseFade,f.baseFade??.10);bindTexture(f.texture,3,spriteUniforms.uSprite);gl.drawArrays(gl.TRIANGLES,0,6);}gl.disable(gl.SCISSOR_TEST);gl.disable(gl.BLEND);}
    paintParticles(gust);frameCount++;metricsFrames++;frameMs=frameMs*.95+(performance.now()-cpuStart)*.05;
    if(now-metricsStart>=2000){fps=metricsFrames*1000/(now-metricsStart);metricsFrames=0;metricsStart=now;if(options.quality!=='fixed'&&active&&now-lastQualityCheck>15000&&fps<27&&qualityScale>.65){qualityScale=Math.max(.65,qualityScale-.1);lastQualityCheck=now;resize();}}
    options.onFrame?.({time,delta:active?scaledDelta:0,wallDelta:delta,speed:settings.speed,windTime,waterTime,cloudTime,lightTime,wind:settings.wind,water:settings.water,cloud:settings.cloud,gust,windFront,playing:active,sceneId:scene.id});
    if(active&&!force)raf=requestAnimationFrame(draw);
  }
  function invalidate(){if(disposed||raf||document.hidden)return;raf=requestAnimationFrame(draw);}
  function listen(target,event,handler){target.addEventListener(event,handler);listeners.push(()=>target.removeEventListener(event,handler));}
  listen(window,'resize',resize);listen(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;options.onFrame?.({time,delta:0,speed:settings.speed,windTime,waterTime,cloudTime,lightTime,wind:settings.wind,water:settings.water,cloud:settings.cloud,gust:0,playing:false,sceneId:scene.id});}else{last=0;metricsStart=performance.now();metricsFrames=0;invalidate();}});listen(reduced,'change',()=>{cancelAnimationFrame(raf);raf=0;invalidate();});
  const interactionTarget=options.interactionTarget||canvas.parentElement;
  listen(interactionTarget,'pointerdown',e=>{if(!running()||e.target.closest('button,a,input,dialog,select,textarea'))return;const rect=canvas.getBoundingClientRect(),tr=getTransform(rect.width,rect.height);const px=(e.clientX-rect.left-tr.x)/tr.width,py=(e.clientY-rect.top-tr.y)/tr.height;const polygons=scene.water?.polygons||(scene.water?.polygon?[scene.water.polygon]:[]);if(polygons.some(poly=>pointInPolygon(px,py,poly))){ripples.set([px,py,waterTime],rippleIndex*3);rippleIndex=(rippleIndex+1)%4;invalidate();}});
  listen(canvas,'webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;options.onError?.(new Error('Graphics context paused. Restoration will be attempted automatically.'));});
  listen(canvas,'webglcontextrestored',()=>{textures.clear();shaders.clear();programs.clear();init();artTexture=texture(image);maskTexture=texture(makeMask(scene));foreground=foreground.map(f=>({...f,texture:texture(f.source)}));resize();last=0;invalidate();});
  await load(scene);
  return {
    setScene:next=>load(next),
    setSettings(next={}){for(const key of ['wind','water','cloud','light'])if(Number.isFinite(next[key]))settings[key]=clamp(next[key],0,3);if(Number.isFinite(next.speed))settings.speed=clamp(next.speed,.25,3);if(Number.isFinite(next.volume))settings.volume=clamp(next.volume,0,1);if(typeof next.motion==='boolean')settings.motion=next.motion;invalidate();},
    setPlaying(value,{userInitiated=false}={}){playing=!!value;if(playing&&userInitiated)userMotionOverride=true;if(!playing){cancelAnimationFrame(raf);raf=0;}last=0;invalidate();return playing;},
    async snapshot({width:outW,height:outH,type='image/png',quality=.95}={}){if(!image)throw Error('Artwork is loading.');cancelAnimationFrame(raf);raf=0;const oldW=canvas.width,oldH=canvas.height;try{if(outW&&outH){canvas.width=clamp(Math.round(outW),1,7680);canvas.height=clamp(Math.round(outH),1,4320);overlay.width=canvas.width;overlay.height=canvas.height;gl.viewport(0,0,canvas.width,canvas.height);}draw(performance.now(),true);const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;const ctx=c.getContext('2d');ctx.drawImage(canvas,0,0);ctx.drawImage(overlay,0,0);return await new Promise((resolve,reject)=>c.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed.')),type,quality));}finally{canvas.width=oldW;canvas.height=oldH;overlay.width=oldW;overlay.height=oldH;gl.viewport(0,0,oldW,oldH);draw(performance.now(),true);invalidate();}},
    getMetrics(){return {backend:'webgl',sceneId:scene.id,playing:running(),reducedMotion:reduced.matches,reducedMotionOverridden:userMotionOverride,speed:settings.speed,renderedFrames:frameCount,fps:Number(fps.toFixed(1)),cpuFrameMs:Number(frameMs.toFixed(2)),renderWidth:canvas.width,renderHeight:canvas.height,sourceWidth:image?.width||0,sourceHeight:image?.height||0,qualityScale,activeRaf:!!raf,sourceIsNative4K:(image?.width||0)>=3840&&(image?.height||0)>=2160};},
    destroy(){if(disposed)return;disposed=true;loadVersion++;cancelAnimationFrame(raf);raf=0;listeners.forEach(unlisten=>unlisten());textures.forEach(t=>gl.deleteTexture(t));shaders.forEach(s=>gl.deleteShader(s));programs.forEach(p=>gl.deleteProgram(p));gl.deleteBuffer(quad);overlay.remove();},
  };
}
function pointInPolygon(x,y,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [xi,yi]=polygon[i],[xj,yj]=polygon[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
async function createStaticFallback(canvas,scene,options){
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Neither WebGL nor 2D canvas is available.');let image=await imageLoad(scene.image),disposed=false;
  function draw(){const r=canvas.getBoundingClientRect();canvas.width=Math.max(1,r.width);canvas.height=Math.max(1,r.height);ctx.fillStyle='#111714';ctx.fillRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.width/image.width,canvas.height/image.height);ctx.drawImage(image,(canvas.width-image.width*scale)/2,(canvas.height-image.height*scale)/2,image.width*scale,image.height*scale);}
  draw();window.addEventListener('resize',draw);return {async setScene(next){scene=normalizeScene(next);image=await imageLoad(scene.image);if(!disposed)draw();},setSettings(){},setPlaying(){return false;},snapshot(){return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));},getMetrics(){return {backend:'canvas2d-static',sceneId:scene.id,playing:false,renderWidth:canvas.width,renderHeight:canvas.height,sourceWidth:image.width,sourceHeight:image.height};},destroy(){disposed=true;window.removeEventListener('resize',draw);}};
}
