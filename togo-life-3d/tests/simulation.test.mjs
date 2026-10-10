import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation, createState } from '../src/simulation.js';
const at=location=>({location});
test('trade requires money, carrying capacity and physical endpoints',()=>{
 const s=new Simulation();assert.equal(s.act('buy',at('kiosk')).ok,false);
 assert.equal(s.act({type:'buy',quantity:13},at('market')).ok,false);
 assert.equal(s.act({type:'buy',quantity:12},at('market')).ok,true);assert.equal(s.state.money,10800);
 assert.equal(s.act('deposit',at('kiosk')).ok,false);assert.equal(s.act('invest',at('kiosk')).ok,true);
 assert.equal(s.act('deposit',at('market')).ok,false);assert.equal(s.act('deposit',at('kiosk')).ok,true);
 assert.equal(s.state.stock,12);assert.equal(s.state.carried,0);
 s.act({type:'price',price:450},at('kiosk'));s.tick(1);
 assert.equal(s.state.sales,0,'a stocked kiosk cannot earn before a customer arrives');
 s.tick(59);
 const purchases=s.state.society.trades.filter(trade=>trade.venue==='kiosk');
 assert.ok(purchases.length>0);assert.equal(s.state.sales,purchases.length);
 assert.equal(s.state.stock,12-purchases.length);assert.equal(s.state.money,1800+purchases.length*450);
 assert.equal(s.state.goodsCostSold,purchases.length*350);assert.equal(s.state.stockCost,s.state.stock*350);
 for(const trade of purchases){
  assert.ok(s.state.society.agents.some(agent=>agent.id===trade.buyerId&&agent.role==='client'));
  assert.ok(Math.hypot(trade.actorX+13,trade.actorZ-25)<=.55,'customer purchased before reaching the kiosk');
  assert.equal(trade.actorWalletBefore-trade.actorWalletAfter,450);
  assert.equal(trade.playerMoneyAfter-trade.playerMoneyBefore,450);
  assert.equal(trade.stockBefore-trade.stockAfter,1);
 }
});
test('high prices reduce sales and cannot create money without stock',()=>{
 const s=new Simulation();s.tick(60);assert.equal(s.state.money,15000);s.act('invest',at('kiosk'));s.act({type:'buy',quantity:4},at('market'));s.act('deposit',at('kiosk'));s.act({type:'price',price:1100},at('kiosk'));s.tick(60);assert.equal(s.state.sales,0);assert.equal(s.state.stock,4);
});
test('contracts require collection then separate destination, dialogue cannot farm reputation',()=>{
 const s=new Simulation();assert.equal(s.act('deliver',at('studio')).ok,false);s.act('contract',at('market'));assert.equal(s.act('deliver',at('market')).ok,false);assert.equal(s.act('contract',at('market')).ok,false);s.act('deliver',at('studio'));assert.equal(s.state.money,16200);assert.equal(s.act('deliver',at('studio')).ok,false);
 s.act('talk',{npcId:'ama'});assert.equal(s.act('talk',{npcId:'ama'}).ok,false);assert.equal(s.state.rep,2);
});
test('time creates rent debt, needs decay and expired deliveries are removed',()=>{
 const s=new Simulation();s.act('contract',at('market'));for(let i=0;i<25;i++)s.tick(60);assert.ok(s.state.day>=3);assert.ok(s.state.debt>=1600);assert.equal(s.state.contract,null);assert.ok(s.state.food<90);assert.equal(s.act('rest',at('home')).ok,false);assert.equal(s.act('rent',at('home')).ok,true);assert.equal(s.state.debt,0);
});
test('strict saves roundtrip, reject malicious values atomically and migrate legacy conservatively',()=>{
 const s=new Simulation();s.act('contract',at('market'));const snap=s.snapshot();assert.equal(new Simulation().load(JSON.stringify(snap)),true);
 for(const bad of [{...snap,money:Infinity},{...snap,carried:99},{...snap,price:0},{...snap,contract:{reward:9999}},{...snap,conversations:['x'.repeat(100)]},{...snap,day:1.2}]){const before=s.snapshot();assert.equal(s.load(bad),false);assert.deepEqual(s.snapshot(),before);}
 assert.equal(s.load({money:1234,name:'Ama',biz:true,stock:1000}),true);assert.equal(s.state.money,1234);assert.equal(s.state.biz,false);assert.equal(s.state.stock,0);assert.equal(s.load('{broken'),false);assert.equal(createState().version,3);
});
test('appearance and position survive a save, invalid appearance and coordinates reject atomically',()=>{const s=new Simulation();s.state.appearance={shirt:'#217d7b',skin:'#936044'};s.state.position={x:16,z:24};const saved=s.snapshot(),t=new Simulation();assert.equal(t.load(saved),true);assert.deepEqual(t.state.appearance,s.state.appearance);assert.deepEqual(t.state.position,s.state.position);assert.equal(t.load({...saved,position:{x:Infinity,z:0}}),false);assert.equal(t.load({...saved,appearance:{shirt:'red',skin:'red'}}),false)});
test('delivery is available only once per game day',()=>{const s=new Simulation();s.act('contract',at('market'));s.act('deliver',at('studio'));assert.equal(s.act('contract',at('market')).ok,false);for(let i=0;i<9;i++)s.tick(60);assert.equal(s.state.day,2);assert.equal(s.act('contract',at('market')).ok,true)});

test('version two migration preserves the player and derives the historical 350 F cost basis',()=>{
 const old=new Simulation().snapshot();old.version=2;
 Object.assign(old,{money:7654,day:4,time:16.4,energy:62,food:54,rep:7,experience:10,
  carried:4,stock:7,biz:true,price:450,sales:3,revenue:1350,costs:10000,debt:800,
  rentPaid:3,home:true,completed:2,lastContractDay:4,saleClock:8.5,
  appearance:{shirt:'#217d7b',skin:'#936044'},position:{x:16,z:24},
  contract:{origin:'market',destination:'studio',deadline:5,reward:1200},
  conversations:['resident-2'],events:['Ancien comptoir ouvert.']});
 for(const field of ['society','carriedCost','stockCost','goodsCostSold','stepRemainder'])delete old[field];
 const unchanged=structuredClone(old),restored=new Simulation();
 assert.equal(restored.load(JSON.stringify(old)),true);assert.equal(restored.state.version,3);
 for(const [key,value]of Object.entries(old))if(key!=='version')assert.deepEqual(restored.state[key],value,key+' was lost during migration');
 assert.equal(restored.state.carriedCost,1400);assert.equal(restored.state.stockCost,2450);assert.equal(restored.state.goodsCostSold,1050);
 assert.equal(restored.state.society.ticks,0);assert.equal(restored.state.society.startDay,4);assert.equal(restored.state.society.startTime,16.4);
 assert.equal(restored.state.society.agents.length,8);assert.equal(restored.state.society.agents[0].name,'Ama');
 assert.equal(restored.state.society.trades.length,0);assert.equal(restored.state.stepRemainder,0);
 assert.deepEqual(old,unchanged,'migration mutated the old save');
 const again=new Simulation();assert.equal(again.load(restored.snapshot()),true);assert.deepEqual(again.snapshot(),restored.snapshot());
});

test('unknown versions and malformed version three society reject the whole load atomically',()=>{
 const s=new Simulation();s.act({type:'buy',quantity:4},at('market'));s.tick(1);
 const saved=s.snapshot();
 const invalid=[];
 for(const version of [0,1,4,999,'3'])invalid.push({...structuredClone(saved),version,money:999});
 const mutations=[
  x=>x.society=null,x=>x.society.version=2,x=>x.society.agents.pop(),
  x=>x.society.agents[1].wallet=Infinity,x=>x.society.agents[1].id='impostor',
  x=>x.society.agents[1].blackboard.route=[0,14],x=>x.society.trades[0].playerMoneyAfter++,
  x=>x.society.supplier.quote={quantity:4,unitPrice:1,expiresAt:x.society.ticks+1},
  x=>x.stepRemainder=.25,x=>x.carriedCost=-1,
 ];
 for(const mutate of mutations){const bad=structuredClone(saved);bad.money=999;mutate(bad);invalid.push(bad);}
 for(const bad of invalid){const before=s.snapshot(),input=structuredClone(bad);assert.equal(s.load(bad),false);assert.deepEqual(s.snapshot(),before);assert.deepEqual(bad,input,'rejected input was mutated');}
});
