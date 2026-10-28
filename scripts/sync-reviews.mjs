import {readFile,writeFile} from 'node:fs/promises';
import scenes from '../scenes.js';
const reports=JSON.parse(await readFile(new URL('../review-data.json',import.meta.url),'utf8'));
for(const scene of scenes){
  const report=reports[scene.id];if(!report)continue;
  const scores=Object.values(report.scores||{}).map(v=>typeof v==='number'?v:v?.score);
  if(report.status==='passed'){
    if(scores.length!==8||scores.some(v=>!Number.isFinite(v)||v<0||v>10))throw Error(`Invalid eight-dimension review: ${scene.id}`);
    const avg=scores.reduce((s,v)=>s+v,0)/8,high=scores.filter(v=>v>7.5).length;
    if(avg<8-1e-10||high<5)throw Error(`Passed label contradicts rubric: ${scene.id}`);
    if(Math.abs(avg-report.average)>.00001||high!==report.highCount)throw Error(`Review calculation mismatch: ${scene.id}`);
  }
  scene.review={...report,average:Number.isFinite(report.average)?Number(report.average.toFixed(6)):null,report:`reviews/${scene.id}.md`};
}
await writeFile(new URL('../scenes.js',import.meta.url),`const scenes = ${JSON.stringify(scenes,null,2)};\nexport default scenes;\n`);
console.log(`Synced ${Object.keys(reports).length} independent reports; ${scenes.filter(s=>s.review?.status==='passed').length}/${scenes.length} passed.`);
