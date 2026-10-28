import {readFile,writeFile} from 'node:fs/promises';
import scenes from '../scenes.js';

const report=JSON.parse(await readFile(new URL('../reviews/motion-results.json',import.meta.url),'utf8'));
for(const scene of scenes){
  const result=report.scenes?.[scene.id];
  if(!result)continue;
  if(!['passed','revise','unverified'].includes(result.status))throw Error(`Unknown motion status: ${scene.id}`);
  if(result.status==='passed'&&(!result.defaultObservation||!result.maxObservation||!result.zeroControlObservation||!result.evidence?.length||result.issues?.length))throw Error(`Incomplete passing motion evidence: ${scene.id}`);
  scene.motionReview={...result,round:report.round,note:result.status==='passed'
    ?(scene.kind==='embedded'?'独立三维播放、暂停恢复、退出卸载及再次打开已实看验证。':'本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。')
    :result.status==='revise'?'本轮动效正在根据独立实看反馈精修。':'本轮动效与控制尚待完成独立复验。'};
}
await writeFile(new URL('../scenes.js',import.meta.url),`const scenes = ${JSON.stringify(scenes,null,2)};\nexport default scenes;\n`);
console.log(`Motion review synced: ${scenes.filter(s=>s.motionReview?.status==='passed').length}/${scenes.length} verified. Historical eight-dimension scores untouched.`);
