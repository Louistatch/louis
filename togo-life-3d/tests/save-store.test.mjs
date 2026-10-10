import test from 'node:test';
import assert from 'node:assert/strict';
import {readSave,writeSave} from '../src/save-store.js';
import {Simulation,createState} from '../src/simulation.js';

const KEY='togo-life:montagne:v2',BACKUP=KEY+':backup';
const raw=progress=>JSON.stringify({version:1,progress});
const valid=source=>{const s=JSON.parse(source);return s.version===1&&Number.isFinite(s.progress)&&s.progress>=0;};
const validSimulation=source=>new Simulation().load(source);

// Like Web Storage, failed setItem calls are atomic: the previous value stays.
class Storage {
  constructor(entries={}) {this.items=new Map(Object.entries(entries));this.calls=[];this.readFailures=new Set();this.writeFailures=new Set();}
  getItem(key) {
    this.calls.push({method:'getItem',key});
    if(this.readFailures.has(key))throw new Error('Storage access blocked');
    return this.items.get(key)??null;
  }
  setItem(key,value) {
    this.calls.push({method:'setItem',key});
    if(this.writeFailures.has(key)){const error=new Error('Quota exceeded');error.name='QuotaExceededError';throw error;}
    this.items.set(key,String(value));
  }
}
const writes=storage=>storage.calls.filter(c=>c.method==='setItem');

test('empty storage reads as no save, without creating recovery or other keys',()=>{
  const store=new Storage();
  assert.deepEqual(readSave(store,KEY,valid),{data:null,recovered:false,primaryInvalid:false});
  assert.equal(store.items.size,0);assert.equal(writes(store).length,0);
});

test('a valid primary wins and does not even access a blocked backup',()=>{
  const store=new Storage({[KEY]:raw(8),[BACKUP]:raw(3)});store.readFailures.add(BACKUP);
  assert.deepEqual(readSave(store,KEY,valid),{data:raw(8),recovered:false,primaryInvalid:false});
  assert.deepEqual(store.calls,[{method:'getItem',key:KEY}]);
});

test('corrupt primary recovers backup without deleting or repairing the source',()=>{
  const store=new Storage({[KEY]:'{broken',[BACKUP]:raw(7)}),before=new Map(store.items);
  assert.deepEqual(readSave(store,KEY,valid),{data:raw(7),recovered:true,primaryInvalid:true});
  assert.deepEqual(store.items,before);assert.equal(writes(store).length,0);
});

test('missing primary can recover a valid backup without being called corrupt',()=>{
  const store=new Storage({[BACKUP]:raw(5)});
  assert.deepEqual(readSave(store,KEY,valid),{data:raw(5),recovered:true,primaryInvalid:false});
  assert.equal(store.items.has(KEY),false);
});

test('two invalid saves remain untouched and never offer a false continue',()=>{
  const store=new Storage({[KEY]:'{broken',[BACKUP]:'null'}),before=new Map(store.items);
  assert.deepEqual(readSave(store,KEY,valid),{data:null,recovered:false,primaryInvalid:true});
  assert.deepEqual(store.items,before);assert.equal(writes(store).length,0);
});

test('unreadable storage never throws; a separately accessible backup is still recoverable',()=>{
  const store=new Storage({[KEY]:raw(9),[BACKUP]:raw(4)});store.readFailures.add(KEY);
  assert.deepEqual(readSave(store,KEY,valid),{data:raw(4),recovered:true,primaryInvalid:false});
  store.readFailures.add(BACKUP);
  assert.deepEqual(readSave(store,KEY,valid),{data:null,recovered:false,primaryInvalid:false});
  assert.deepEqual(readSave(null,KEY,valid),{data:null,recovered:false,primaryInvalid:false});
});

test('first save seeds a valid recovery point and commits the historical primary key',()=>{
  const store=new Storage();assert.deepEqual(writeSave(store,KEY,raw(1),valid),{ok:true});
  assert.deepEqual([...store.items],[[BACKUP,raw(1)],[KEY,raw(1)]]);
  assert.deepEqual(writes(store).map(c=>c.key),[BACKUP,KEY]);
  store.items.set(KEY,'truncated');
  assert.equal(readSave(store,KEY,valid).data,raw(1));
});

test('successful checkpoint keeps the previous loadable primary as backup',()=>{
  const store=new Storage({[KEY]:raw(3),[BACKUP]:raw(1)});
  assert.deepEqual(writeSave(store,KEY,raw(8),valid),{ok:true});
  assert.equal(store.items.get(KEY),raw(8));assert.equal(store.items.get(BACKUP),raw(3));
  assert.equal(store.items.size,2);
});

test('an explicit new save over a corrupt primary preserves an existing valid backup',()=>{
  const store=new Storage({[KEY]:'{broken',[BACKUP]:raw(5)});
  assert.deepEqual(writeSave(store,KEY,raw(9),valid),{ok:true});
  assert.equal(store.items.get(KEY),raw(9));assert.equal(store.items.get(BACKUP),raw(5));
  assert.deepEqual(writes(store).map(c=>c.key),[KEY]);
});

test('backup quota failure aborts before the previous primary is touched',()=>{
  const store=new Storage({[KEY]:raw(5),[BACKUP]:raw(2)}),before=new Map(store.items);store.writeFailures.add(BACKUP);
  assert.deepEqual(writeSave(store,KEY,raw(9),valid),{ok:false,reason:'backup-write-failed'});
  assert.deepEqual(store.items,before);assert.deepEqual(writes(store).map(c=>c.key),[BACKUP]);
});

test('primary quota failure retains the old primary and a loadable backup of that same state',()=>{
  const store=new Storage({[KEY]:raw(5),[BACKUP]:raw(2)});store.writeFailures.add(KEY);
  assert.deepEqual(writeSave(store,KEY,raw(9),valid),{ok:false,reason:'primary-write-failed'});
  assert.equal(store.items.get(KEY),raw(5));assert.equal(store.items.get(BACKUP),raw(5));
  assert.equal(readSave(store,KEY,valid).data,raw(5));
});

test('storage access failure refuses a write without touching either existing key',()=>{
  const store=new Storage({[KEY]:raw(5),[BACKUP]:raw(2)}),before=new Map(store.items);store.readFailures.add(KEY);
  assert.deepEqual(writeSave(store,KEY,raw(9),valid),{ok:false,reason:'storage-unavailable'});
  assert.deepEqual(store.items,before);assert.equal(writes(store).length,0);
  assert.deepEqual(writeSave(null,KEY,raw(9),valid),{ok:false,reason:'storage-unavailable'});
});

test('unknown backup accessibility prevents replacing the only possible recovery state',()=>{
  const store=new Storage({[KEY]:'corrupt',[BACKUP]:raw(2)}),before=new Map(store.items);store.readFailures.add(BACKUP);
  assert.deepEqual(writeSave(store,KEY,raw(9),valid),{ok:false,reason:'storage-unavailable'});
  assert.deepEqual(store.items,before);assert.equal(writes(store).length,0);
});

test('invalid data, validator exceptions and non-boolean approval cannot overwrite progress',()=>{
  const store=new Storage({[KEY]:raw(5),[BACKUP]:raw(2)}),before=new Map(store.items);
  for(const value of ['{broken','null',raw(-1),JSON.stringify({version:999,progress:3}),{version:1,progress:3},null]) {
    assert.deepEqual(writeSave(store,KEY,value,valid),{ok:false,reason:'invalid-data'});
  }
  assert.deepEqual(writeSave(store,KEY,raw(8),()=>{throw new Error('Schema failure');}),{ok:false,reason:'invalid-data'});
  assert.deepEqual(writeSave(store,KEY,raw(8),()=>({ok:true})),{ok:false,reason:'invalid-data'});
  assert.deepEqual(writeSave(store,'',raw(8),valid),{ok:false,reason:'invalid-key'});
  assert.deepEqual(store.items,before);assert.equal(store.calls.length,0);
});

test('Simulation rejects a future-version primary, recovers the current backup and preserves future bytes',()=>{
  const current=JSON.stringify(new Simulation().snapshot()),future=JSON.stringify({...createState(),version:9999});
  const store=new Storage({[KEY]:future,[BACKUP]:current});
  assert.deepEqual(readSave(store,KEY,validSimulation),{data:current,recovered:true,primaryInvalid:true});
  assert.equal(store.items.get(KEY),future);
  assert.deepEqual(writeSave(store,KEY,future,validSimulation),{ok:false,reason:'invalid-data'});
  assert.equal(writes(store).length,0);
  assert.deepEqual(writeSave(store,KEY,current,validSimulation),{ok:true});
  assert.equal(store.items.get(BACKUP),current);
});

test('actual v2 migration remains validator-owned and the first v3 checkpoint preserves v2 backup',()=>{
  const legacy={...createState(),version:2,money:21700,carried:3,stock:2,biz:true,sales:1};
  for(const key of ['society','carriedCost','stockCost','goodsCostSold','stepRemainder'])delete legacy[key];
  const source=JSON.stringify(legacy),store=new Storage({[KEY]:source});
  const loaded=readSave(store,KEY,validSimulation);
  assert.deepEqual(loaded,{data:source,recovered:false,primaryInvalid:false});
  const sim=new Simulation();assert.equal(sim.load(loaded.data),true);
  assert.equal(sim.state.version,3);assert.equal(sim.state.money,21700);
  assert.equal(sim.state.carriedCost,1050);assert.equal(sim.state.stockCost,700);assert.equal(sim.state.goodsCostSold,350);
  const upgraded=JSON.stringify(sim.snapshot());
  assert.deepEqual(writeSave(store,KEY,upgraded,validSimulation),{ok:true});
  assert.equal(store.items.get(KEY),upgraded);assert.equal(store.items.get(BACKUP),source);
  const restarted=new Simulation();assert.equal(restarted.load(readSave(store,KEY,validSimulation).data),true);
  assert.deepEqual(restarted.snapshot(),sim.snapshot());
});
