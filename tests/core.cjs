const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function setup(store={}){const elements=new Map(),get=s=>{if(!elements.has(s))elements.set(s,{innerHTML:'',textContent:'',value:'40',focus(){}});return elements.get(s)};const c={console,Date,Math,JSON,Set,Number,String,Object,Array,confirm:()=>true,alert:()=>{},setInterval:()=>1,clearInterval:()=>{},setTimeout:()=>{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},document:{querySelector:get,querySelectorAll:()=>[]},window:{scrollTo(){}},Blob,URL};vm.createContext(c);for(const f of ['questions.js','content.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return {run:s=>vm.runInContext(s,c),store,get}}
let t=setup();
assert.equal(t.run('QUESTIONS.length'),108);
assert.equal(t.run('new Set(QUESTIONS.map(q=>q.id)).size'),108);
assert.equal(t.run('QUESTIONS.every(q=>DOMAINS[q.d] && q.o.length===4 && Number.isInteger(q.a) && q.a>=0 && q.a<4 && q.fr && q.x)'),true);
assert.equal(t.run('QUESTIONS.every(q=>!q.source || SOURCES[q.source])'),true);
for(const n of [5,10,15]){assert.equal(t.run(`balanced(${n}).length`),4*n);assert.equal(t.run(`new Set(balanced(${n}).map(q=>q.id)).size`),4*n)}
t.run('startDiagnostic();selectOpt(session.qs[0].a);checkAnswer()');assert.match(t.get('#app').innerHTML,/Bonne réponse/);
t=setup(t.store);assert.match(t.get('#app').innerHTML,/Bonne réponse/);t.run('finish(true)');assert.equal(t.run('state.history[0].correct'),1);assert.equal(t.run('state.history[0].total'),20);assert.equal(t.run('state.history[0].rows.filter(x=>x.sel===null).length'),19);
t.run('startQuiz(balanced(10),true,"Test");selectOpt(session.qs[0].a)');assert.doesNotMatch(t.get('#app').innerHTML,/Bonne réponse/);const deadline=t.run('session.deadline');t=setup(t.store);assert.equal(t.run('session.deadline'),deadline);assert.equal(t.run('session.answers[0]===session.qs[0].a'),true);
t.run('session.deadline=Date.now()-1;saveSession()');t=setup(t.store);assert.equal(t.run('session'),null);assert.equal(t.run('state.history[0].total'),40);assert.equal(t.run('state.history[0].correct'),1);assert.equal(t.run('state.history.length'),2);t=setup(t.store);assert.equal(t.run('state.history.length'),2);
t.run('startPractice("sjt");selectOpt(session.qs[0].a);checkAnswer();selectOpt((session.qs[0].a+1)%4)');assert.equal(t.run('session.answers[0]===session.qs[0].a'),true);t.run('finish(true)');
for(const v of ['learn','news','practice','exam','progress','plan','dashboard']){t.run(`showView('${v}')`);assert.ok(t.get('#app').innerHTML.length>100)}
assert.doesNotThrow(()=>setup({'ypp-prep-v2':'broken json','ypp-session-v2':'broken json'}));
console.log('PASS: question integrity; balanced unique selections; immutable checked answers; persistent session/deadline; expiry; omitted-answer scoring; no duplicate history; all views; corrupt JSON fallback. DOM layout not covered.');
