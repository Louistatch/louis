const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function setup(store={}){const elements=new Map(),get=s=>{if(!elements.has(s))elements.set(s,{innerHTML:'',textContent:'',value:'40',focus(){}});return elements.get(s)};const c={console,Date,Math,JSON,Set,Number,String,Object,Array,confirm:()=>true,alert:()=>{},setInterval:()=>1,clearInterval:()=>{},setTimeout:()=>{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},document:{querySelector:get,querySelectorAll:()=>[]},window:{scrollTo(){}},Blob,URL};vm.createContext(c);for(const f of ['questions.js','content.js','bryq.js','mastery.js','expert-bank.js','coaching.js','simulation.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return {run:s=>vm.runInContext(s,c),store,get}}
let t=setup();
assert.equal(t.run('QUESTIONS.length'),508);
assert.equal(t.run('new Set(QUESTIONS.map(q=>q.id)).size'),508);
assert.equal(t.run('QUESTIONS.every(q=>DOMAINS[q.d] && q.o.length>=3 && q.o.length<=4 && Number.isInteger(q.a) && q.a>=0 && q.a<q.o.length && q.fr && q.x)'),true);

assert.equal(t.run('QUESTIONS.filter(q=>q.kind==="verbal").length'),141);
assert.equal(t.run('QUESTIONS.every(q=>!q.source || SOURCES[q.source])'),true);
for(const n of [5,10,15]){assert.equal(t.run(`balanced(${n}).length`),4*n);assert.equal(t.run(`new Set(balanced(${n}).map(q=>q.id)).size`),4*n)}
t.run('startDiagnostic();selectOpt(session.qs[0].a);setConfidence("high");checkAnswer()');assert.match(t.get('#app').innerHTML,/Bonne réponse/);assert.match(t.get('#app').innerHTML,/confiance forte/);
t=setup(t.store);assert.match(t.get('#app').innerHTML,/Bonne réponse/);t.run('finish(true)');assert.equal(t.run('state.history[0].correct'),1);assert.equal(t.run('state.history[0].total'),20);assert.equal(t.run('state.history[0].rows.filter(x=>x.sel===null).length'),19);
t.run('startQuiz(balanced(10),true,"Test",{strict:true,durationMs:2700000,kind:"exam"});selectOpt(session.qs[0].a)');assert.doesNotMatch(t.get('#app').innerHTML,/Bonne réponse/);const deadline=t.run('session.deadline');t=setup(t.store);assert.equal(t.run('session.deadline'),deadline);assert.equal(t.run('session.answers[0]===session.qs[0].a'),true);
t.run('session.deadline=Date.now()-1;saveSession()');t=setup(t.store);assert.equal(t.run('session'),null);assert.equal(t.run('state.history[0].total'),40);assert.equal(t.run('state.history[0].correct'),1);assert.equal(t.run('state.history.length'),2);t=setup(t.store);assert.equal(t.run('state.history.length'),2);
t.run('startVerbalSprint()');assert.equal(t.run('session.qs.length'),9);assert.equal(t.run('session.qs.every(q=>q.kind==="verbal"&&q.o.length===3)'),true);t.run('finish(true)');
t.run('startSjtSprint()');assert.equal(t.run('session.qs.length'),12);assert.equal(t.run('session.strict'),true);t.run('finish(true)');
t.run('startSpeedSprint()');assert.equal(t.run('session.qs.length'),12);assert.equal(t.run('new Set(session.qs.map(q=>q.d)).size'),4);t.run('finish(true)');
t.run('startPractice("sjt");selectOpt(session.qs[0].a);checkAnswer();selectOpt((session.qs[0].a+1)%4)');assert.equal(t.run('session.answers[0]===session.qs[0].a'),true);t.run('finish(true)');
for(const v of ['learn','news','practice','exam','verbal','lab','immersive','research','progress','plan','dashboard']){t.run(`showView('${v}')`);assert.ok(t.get('#app').innerHTML.length>100)}
assert.doesNotThrow(()=>setup({'ypp-prep-v2':'broken json','ypp-session-v2':'broken json'}));
console.log('PASS: 508-question integrity; domain sampling; 3/4-option formats; verbal sprint; SJT sprint; mixed sprint; confidence capture; balanced selections; immutable checked answers; persistent session/deadline; expiry; omitted-answer scoring; no duplicate history; all views; corrupt JSON fallback. DOM layout not covered.');

t=setup();t.run('startExam()');assert.equal(t.run('session.qs.length'),50);assert.equal(t.run('session.deadline-session.start'),3000000);assert.equal(t.run('new Set(session.qs.map(q=>q.id)).size'),50);t.run('finish(false)');assert.notEqual(t.run('session'),null);t.run('selectOpt(session.qs[0].a);checkAnswer()');assert.equal(t.run('Object.keys(session.checked).length'),0);t.run('session.qs.forEach((q,i)=>session.answers[i]=q.a);finish(false)');assert.equal(t.run('state.history[0].correct'),50);
t.run('startQuiz(examQuestions(),true,"Forward",{strict:true,forward:true,durationMs:3000000});jump(1)');assert.equal(t.run('session.i'),0);t.run('selectOpt(0);move(1);jump(0)');assert.equal(t.run('session.i'),1);t.run('abandon()');assert.equal(t.run('state.history[0].status'),'abandoned');
t.run('startItemSprint();session.itemDeadline=Date.now()-1;tick()');assert.equal(t.run('session.i'),1);assert.equal(t.run('session.answers[0]'),undefined);const due=t.run('session.deadline');t=setup(t.store);assert.equal(t.run('session.deadline'),due);t.run('session.deadline=Date.now()-1;tick()');assert.equal(t.run('state.history[0].status'),'expired');assert.equal(t.run('state.history[0].total'),10);
assert.doesNotThrow(()=>setup({'ypp-prep-v2':JSON.stringify({items:null,history:[],days:[]})}));
console.log('PASS: 50/50 format, unique balanced sample, required answers, strict correction guard, forward-only navigation, item timeout, persisted global deadline, abandonment status, null-state recovery.');

// Independent verification of the finite-model questions from their visible constraints.
const permutations=arr=>arr.length===0?[[]]:arr.flatMap((x,i)=>permutations(arr.filter((_,j)=>j!==i)).map(p=>[x,...p]));
const bank=JSON.parse(t.run('JSON.stringify(MASTERY_QUESTIONS)'));
for(const q of bank.filter(q=>q.id.includes('logic-order'))){
 const edges=[...q.stimulus.matchAll(/([A-E]) doit précéder ([A-E])/g)].map(m=>[m[1],m[2]]);
 const models=permutations(['A','B','C','D','E']).filter(p=>edges.every(([a,b])=>p.indexOf(a)<p.indexOf(b)));
 assert.ok(models.length>1);const keys=q.o.map(o=>{const m=o.match(/([A-E]) doit précéder ([A-E])/);return models.every(p=>p.indexOf(m[1])<p.indexOf(m[2]))});assert.equal(keys.filter(Boolean).length,1);assert.equal(keys[q.a],true);
}
for(const q of bank.filter(q=>q.id.includes('logic-role'))){
 const names=['Amina','Benoît','Céline','David'],roles=['analyse','terrain','achats','suivi'];
 const allowed=names.map(n=>q.stimulus.match(new RegExp(n+' peut uniquement assurer : ([^.]+)'))[1].split(', '));
 const models=permutations(roles).filter(p=>p.every((r,i)=>allowed[i].includes(r)));
 assert.ok(models.length>1);const keys=q.o.map(o=>{const m=o.match(/(Amina|Benoît|Céline|David) assure la fonction (\w+)/);return models.every(p=>p[names.indexOf(m[1])]===m[2])});assert.equal(keys.filter(Boolean).length,1);assert.equal(keys[q.a],true);
}
assert.equal(bank.filter(q=>q.kind==='verbal').length,72);for(const a of [0,1,2])assert.equal(bank.filter(q=>q.kind==='verbal'&&q.a===a).length,24);
assert.ok(bank.every(q=>q.lv>=4));assert.ok(bank.filter(q=>q.kind==='verbal').every(q=>q.why.length===3&&q.evidence.every(i=>q.sentences[i])));
t=setup();for(let i=0;i<20;i++){const q=JSON.parse(t.run('JSON.stringify(demandingExam())'));assert.equal(q.length,50);assert.ok(q.every(x=>x.lv>=4));assert.equal(new Set(q.map(x=>x.family)).size,50);assert.ok(q.filter(x=>x.kind==='verbal').length>=8)}
t.get('#difficultyMode').value='advanced';t.run('startExam()');assert.equal(t.run('session.deadline-session.start'),3000000);assert.equal(t.run('session.novelIds.length'),50);t.run('session.qs.forEach((q,i)=>session.answers[i]=q.a);finish(false)');assert.equal(t.run('state.history[0].novelCorrect'),50);assert.equal(t.run('state.history[0].preset'),'advanced');
t.get('#difficultyMode').value='overload';t.run('startExam()');assert.equal(t.run('session.deadline-session.start'),2100000);t.run('abandon()');
t=setup();t.run('startVerbalCoach();selectOpt(session.qs[0].a);checkAnswer()');assert.equal(t.run('Object.keys(session.checked).length'),0);t.run('session.qs[0].evidence.forEach(selectProof);checkAnswer()');assert.equal(t.run('session.checked[0]'),true);assert.match(t.get('#app').innerHTML,/Indices clés/);assert.match(t.get('#app').innerHTML,/isolé les éléments décisifs/);
t=setup(t.store);assert.notEqual(t.run('session'),null);assert.equal(t.run('session.guided'),true);t.run('finish(false)');assert.equal(t.run('state.history[0].rows[0].proof.length'),t.run('QUESTIONS.find(q=>q.id===state.history[0].rows[0].id).evidence.length'));
const saved=JSON.stringify({version:2,state:JSON.parse(t.run('JSON.stringify(state)'))});const reload=setup();reload.run('importProgress')({files:[{size:saved.length,text:async()=>saved}]}).then(()=>{assert.equal(reload.run('state.history[0].preset'),'guided');assert.ok(reload.run('state.history[0].rows[0].proof.length'));console.log('PASS: demanding sampling, independent logic-model verification, balanced verbal keys, mandatory proof and worked feedback, untimed reload, novel-only scores, 35-minute mode, export import compatibility.');}).catch(e=>{console.error(e);process.exitCode=1});

// Expert case integrity and exhaustive logical countermodel checks.
t=setup();
const expert=JSON.parse(t.run('JSON.stringify(EXPERT_QUESTIONS)'));
assert.equal(expert.length,108);
assert.equal(expert.filter(q=>q.kind==='verbal').length,48);
for(const a of [0,1,2])assert.equal(expert.filter(q=>q.kind==='verbal'&&q.a===a).length,16);
assert.ok(expert.every(q=>q.lv===5&&q.why.length===q.o.length));
assert.ok(expert.filter(q=>q.kind==='verbal'&&q.a===2).every(q=>q.worlds?.length===2));
assert.ok(expert.filter(q=>q.kind==='verbal').every(q=>q.evidence.every(i=>q.sentences[i])));
t.run('startUncertainty()');assert.equal(t.run('session.qs.length'),10);assert.equal(t.run('session.qs.every(q=>q.a===2&&q.worlds?.length===2)'),true);t.run('finish(true)');
for(const q of expert.filter(q=>q.model)){
 const {vars,rules,options}=q.model;
 const evaluate=expr=>Function(...vars,`return (${expr});`);
 const check=rules.map(evaluate),alternatives=options.map(evaluate),models=[];
 for(let bits=0;bits<2**vars.length;bits++){const assignment=vars.map((_,i)=>!!(bits&(1<<i)));if(check.every(f=>f(...assignment)))models.push(assignment);}
 assert.ok(models.length>1,q.id+' has multiple admissible cases');
 const necessary=alternatives.map(f=>models.every(m=>f(...m)));
 assert.equal(necessary.filter(Boolean).length,1,q.id+' has one necessary answer');
 assert.equal(necessary[q.a],true,q.id+' key follows from the constraints');
}
for(const profile of ['balanced','verbal'])for(let i=0;i<15;i++){
 const questions=JSON.parse(t.run(`JSON.stringify(expertExam('${profile}'))`));
 assert.equal(questions.length,50);assert.equal(new Set(questions.map(q=>q.family)).size,50);
 assert.ok(questions.filter(q=>q.kind==='verbal').length>=(profile==='verbal'?14:8));
 assert.ok(questions.every(q=>q.lv>=4));
}
// An unseen sibling statement on an old passage is not an unseen family.
t.run("state.items[EXPERT_QUESTIONS[0].id]={ok:true};startQuiz([EXPERT_QUESTIONS[1]],false,'Sibling')");
assert.equal(t.run('session.novelIds.length'),1);assert.equal(t.run('session.familyNovelIds.length'),0);
t.run('selectOpt(session.qs[0].a);finish(false)');assert.equal(t.run('state.history[0].familyNovelTotal'),0);

// Immersive session -> submission -> compulsory mock questionnaire -> final confirmation.
t=setup();t.run('expertHome();startImmersive()');assert.equal(t.run('session'),null);assert.match(t.get('#labError').textContent,/Confirme/);
for(const k of ['quiet','rules','finish'])t.get('#lab-'+k).checked=true;
t.get('#labDuration').value='50';t.get('#labProfile').value='balanced';t.run('startImmersive()');
assert.equal(t.run('session.deadline-session.start'),3000000);assert.equal(t.run('session.forward'),true);assert.equal(t.run('session.immersive'),true);
t.run('document.visibilityState="hidden";onVisibility()');assert.equal(t.run('session.distractions'),1);
const immersiveDeadline=t.run('session.deadline');t=setup(t.store);assert.equal(t.run('session.deadline'),immersiveDeadline);
t.run('session.qs.forEach((q,i)=>session.answers[i]=q.a);finish(false)');
assert.equal(t.run('state.flow.stage'),'submitted');assert.doesNotMatch(t.get('#app').innerHTML,/50 \/ 50 bonnes réponses/);
t.run('showView("progress")');assert.match(t.get('#app').innerHTML,/Il reste une étape/);
t=setup(t.store);assert.equal(t.run('state.flow.stage'),'submitted');t.run('nextDemographic()');assert.match(t.get('#app').innerHTML,/QUESTIONNAIRE FICTIF/);
t.get('#demoNationality').value='other';t.get('#demoConfirm').checked=true;t.run('submitDemographic()');assert.equal(t.run('state.flow.stage'),'demographic');
t.get('#demoNationality').value='togo';t.run('submitDemographic()');assert.equal(t.run('state.flow.stage'),'done');assert.equal(t.run('state.history[0].workflowComplete'),true);
t=setup(t.store);assert.equal(t.run('state.flow.stage'),'done');t.run('closeWorkflow()');assert.equal(t.run('state.flow'),undefined);assert.match(t.get('#app').innerHTML,/50 \/ 50 bonnes réponses/);
assert.equal(t.run('state.history[0].familyNovelTotal'),50);assert.equal(t.run('state.history[0].familyNovelCorrect'),50);
assert.match(t.get('#app').innerHTML,/questionnaire fictif et confirmation terminés/);

// Item timers keep the original cadence even after a suspended or reloaded tab.
t=setup();t.get('#labItemSeconds').value='30';t.run('startPressureDrill()');assert.equal(t.run('session.itemMs'),30000);
t.run('session.start=Date.now()-95000;session.deadline=session.start+360000;session.entered=session.start;session.itemDeadline=session.start+30000;saveSession()');
t=setup(t.store);assert.equal(t.run('session.i'),3);assert.ok(t.run('session.times[0]>=30000'));assert.ok(t.run('session.times[1]>=30000'));assert.ok(t.run('session.times[2]>=30000'));
t.run('session.deadline=Date.now()-1;tick()');assert.equal(t.run('state.history[0].status'),'expired');
console.log('PASS: 108 expert cases, 48 balanced verbal keys, two counter-scenarios, exhaustive logical models, unique family sampling, immersive completion and reload, mock nationality guard, persistent pace and skipped item timeouts.');
