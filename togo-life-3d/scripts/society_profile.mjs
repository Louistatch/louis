import {performance} from 'node:perf_hooks';
import {mkdir,writeFile} from 'node:fs/promises';
import {Simulation} from '../src/simulation.js';

// CPU wall time of the engine-neutral simulation only. This is not GPU time,
// rendered frame rate, Android hardware performance or a browser benchmark.
function scenario(){const sim=new Simulation();sim.act({type:'negotiate',price:315,quantity:12},{location:'market'});sim.act({type:'buy',quantity:12},{location:'market'});sim.act('invest',{location:'kiosk'});sim.act('deposit',{location:'kiosk'});sim.act({type:'price',price:450},{location:'kiosk'});return sim;}
const warm=scenario();for(let i=0;i<1000;i++)warm.tick(.25);
const durations=[],ticksPerSample=1000;
for(let sample=0;sample<40;sample++){const sim=scenario(),start=performance.now();for(let i=0;i<ticksPerSample;i++)sim.tick(.25);durations.push((performance.now()-start)/ticksPerSample);}
durations.sort((a,b)=>a-b);
const report={method:'Node CPU wall time of 1000 fixed 250ms steps per sample, 40 samples, after 1000 warmup steps; fresh eight-resident trading scenario each sample',node:process.version,residents:8,economyHz:4,samples:durations.length,ticksPerSample,medianMsPerStep:durations[20],p95MsPerStep:durations[37],minimumMsPerStep:durations[0],maximumMsPerStep:durations.at(-1),limits:'No renderer; excludes save validation, UI, WebGL, GPU, physical Android and desktop frame rates'};
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/society-profile.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
