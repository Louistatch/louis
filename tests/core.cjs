const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function setup(store={}){const elements=new Map(),get=s=>{if(!elements.has(s))elements.set(s,{innerHTML:'',textContent:'',value:'40',focus(){}});return elements.get(s)};const c={console,Date,Math,JSON,Set,Number,String,Object,Array,confirm:()=>true,alert:()=>{},setInterval:()=>1,clearInterval:()=>{},setTimeout:()=>{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},document:{querySelector:get,querySelectorAll:()=>[]},window:{scrollTo(){}},Blob,URL};vm.createContext(c);for(const f of ['questions.js','content.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return {run:s=>vm.runInContext(s,c),store,get}}
let t=setup();
assert.equal(t.run('QUESTIONS.length'),160);
assert.equal(t.run('new Set(QUESTIONS.map(q=>q.id)).size'),160);
assert.equal(t.run('QUESTIONS.every(q=>DOMAINS[q.d] && q.o.length>=3 && q.o.length<=4 && Number.isInteger(q.a) && q.a>=0 && q.a<q.o.length && q.fr && q.x)'),true);
assert.equal(t.run('Object.values(QUESTIONS.reduce((m,q)=>(m[q.d]=(m[q.d]||0)+1,m),{})).every(n=>n===40)'),true);
assert.equal(t.run('QUESTIONS.filter(q=>q.kind==="verbal").length'),9);
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
for(const v of ['learn','news','practice','exam','progress','plan','dashboard']){t.run(`showView('${v}')`);assert.ok(t.get('#app').innerHTML.length>100)}
assert.doesNotThrow(()=>setup({'ypp-prep-v2':'broken json','ypp-session-v2':'broken json'}));
console.log('PASS: 160-question integrity; 40/domain balance; 3/4-option formats; verbal sprint; SJT sprint; mixed sprint; confidence capture; balanced selections; immutable checked answers; persistent session/deadline; expiry; omitted-answer scoring; no duplicate history; all views; corrupt JSON fallback. DOM layout not covered.');
