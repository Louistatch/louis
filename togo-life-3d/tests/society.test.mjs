import test from 'node:test';
import assert from 'node:assert/strict';
import {createSociety,tickSociety,validateSociety,negotiateSupplier,buySupplier,SOCIETY,BT_STATUS} from '../src/society.js';

const copy=value=>structuredClone(value);
const player=overrides=>({money:15000,costs:0,carried:0,stock:12,biz:true,price:450,sales:0,revenue:0,experience:0,rep:0,stockCost:4200,goodsCostSold:0,society:createSociety(),...overrides});
const cash=state=>state.money+state.society.supplier.wallet+state.society.competitor.wallet+state.society.upstream.wallet+state.society.employer.wallet+state.society.agents.filter(a=>a.role==='client').reduce((n,a)=>n+a.wallet,0);
const goods=state=>state.carried+state.stock+state.society.supplier.stock+state.society.competitor.stock+state.society.upstream.stock+state.society.ledger.consumed+state.society.agents.reduce((n,a)=>n+a.inventory+a.householdFood,0);
const finances=state=>({money:state.money,costs:state.costs,carried:state.carried,stock:state.stock,sales:state.sales,revenue:state.revenue,supplierWallet:state.society.supplier.wallet,supplierStock:state.society.supplier.stock});

test('society has stable heterogeneous profiles and a bounded valid serializable blackboard',()=>{
  const s=createSociety();assert.equal(s.version,1);assert.equal(s.agents.length,8);assert.deepEqual(validateSociety(s),s);
  assert.equal(s.agents[0].name,'Ama');assert.equal(s.agents[0].role,'supplier');assert.deepEqual([s.agents[0].x,s.agents[0].z],[-10,1]);
  assert.equal(new Set(s.agents.map(a=>a.id)).size,8);assert.ok(new Set(s.agents.slice(1).map(a=>a.wallet)).size>=6);
  assert.equal(new Set(s.agents.map(a=>`${a.x}/${a.z}`)).size,8);
  assert.ok(new Set(s.agents.slice(1).map(a=>a.maxPrice)).size>=5);assert.ok(new Set(s.agents.map(a=>a.job)).size>=6);
  assert.equal(s.agents[1].blackboard.status,BT_STATUS.Success);assert.ok(SOCIETY.nodes.length>12);
});

test('negotiation rejects an uneconomic offer, counters a normal offer and remembers trust',()=>{
  const s=player(),money=s.money;
  const rejected=negotiateSupplier(s,{price:150,quantity:4});assert.equal(rejected.ok,false);assert.equal(s.society.supplier.trust,37);assert.equal(s.society.supplier.lastDecision.kind,'rejected');assert.equal(s.society.supplier.quote,null);assert.equal(s.money,money);
  const counter=negotiateSupplier(s,{price:300,quantity:4});assert.equal(counter.ok,true);assert.equal(counter.accepted,false);assert.equal(counter.unitPrice,315);assert.equal(s.society.supplier.lastDecision.kind,'counter');
  assert.deepEqual(s.society.supplier.quote,{quantity:4,unitPrice:315,expiresAt:240});
  const before=cash(s);assert.equal(buySupplier(s,4).ok,true);assert.equal(s.money,13740);assert.equal(s.carried,4);assert.equal(s.society.supplier.wallet,6260);assert.equal(cash(s),before);assert.equal(s.society.supplier.quote,null);
  assert.equal(s.society.supplier.lastDecision.kind,'sold');assert.equal(s.society.supplier.trust,39);assert.deepEqual(validateSociety(s.society),s.society);
  // Accepted quantity is used once: a second purchase returns to standard350.
  assert.equal(buySupplier(s,4).unitPrice,350);assert.equal(s.money,12340);
});

test('supplier accepted offer and cash/stock/capacity failures commit atomically',()=>{
  const s=player();assert.equal(negotiateSupplier(s,{price:315,quantity:4}).accepted,true);
  for(const q of [0,1.5,13,5]){const before=copy(s);assert.equal(buySupplier(s,q).ok,false);assert.deepEqual(s,before);}
  for(const mutate of [v=>v.money=10,v=>v.carried=12,v=>v.society.supplier.stock=1]){
    const failed=copy(s);mutate(failed);const before=copy(failed);assert.equal(buySupplier(failed,4).ok,false);assert.deepEqual(failed,before);
  }
  const before=copy(s);assert.equal(negotiateSupplier(s,{price:NaN,quantity:4}).ok,false);assert.deepEqual(s,before);
  assert.equal(negotiateSupplier(s,{price:300,quantity:8}).accepted,true);assert.equal(s.society.supplier.quote.quantity,8);
});

test('quote expires at the exact serialized decision tick and cannot grant a stale discount',()=>{
  const s=player({biz:false,stock:0});negotiateSupplier(s,{price:315,quantity:4});tickSociety(s,59.75);
  assert.equal(s.society.ticks,239);assert.ok(s.society.supplier.quote);const restored=validateSociety(s.society);assert.ok(restored);
  s.society=restored;tickSociety(s,.25);assert.equal(s.society.ticks,240);assert.equal(s.society.supplier.quote,null);assert.equal(buySupplier(s,4).unitPrice,350);
});

test('every sale requires a visible physical arrival and transfers cash and weighted cost basis',()=>{
  const s=player(),beforeCash=cash(s),beforeGoods=goods(s),start=copy(s.society.agents[4]);
  tickSociety(s,1);assert.equal(s.sales,0);assert.equal(s.society.trades.filter(t=>t.venue==='kiosk').length,0);
  const moving=s.society.agents[4];assert.equal(moving.blackboard.goal,'playerShop');assert.equal(moving.blackboard.status,BT_STATUS.Running);assert.equal(moving.state,'walk');
  assert.ok(Math.hypot(moving.x-start.x,moving.z-start.z)<=moving.speed+.000001);assert.ok(Math.hypot(moving.x+13,moving.z-25)>1);
  tickSociety(s,6);const trade=s.society.trades.find(t=>t.venue==='kiosk');assert.ok(trade);assert.equal(s.sales,1);
  assert.deepEqual([trade.actorX,trade.actorZ],[-13,25]);assert.equal(trade.actorWalletBefore-trade.actorWalletAfter,450);assert.equal(trade.playerMoneyAfter-trade.playerMoneyBefore,450);assert.equal(trade.stockBefore-trade.stockAfter,1);
  assert.equal(s.stockCost,3850);assert.equal(s.goodsCostSold,350);assert.equal(cash(s),beforeCash);assert.equal(goods(s),beforeGoods);
  assert.equal(s.society.agents[4].inventory,1);assert.ok(s.society.agents[4].relationship>20);
  tickSociety(s,40);assert.ok(s.society.ledger.consumed>0);assert.equal(cash(s),beforeCash);assert.equal(goods(s),beforeGoods);assert.ok(s.society.agents[4].food>60);
});

test('player price changes actual client decisions and their refusal survives restoration',()=>{
  const s=player({price:1100});tickSociety(s,1);
  assert.ok(s.society.agents.slice(1).every(a=>a.blackboard.goal!=='playerShop'));assert.equal(s.sales,0);
  const competitor=s.society.agents[5];assert.equal(competitor.memory.lastChoice,'competitor');assert.equal(competitor.memory.refusedPrice,1100);
  const saved=copy(s),restored=validateSociety(saved.society);assert.deepEqual(restored,saved.society);s.society=restored;
  assert.equal(s.society.agents[5].memory.refusedPrice,1100);s.price=450;tickSociety(s,2);
  assert.equal(s.society.agents[4].memory.lastChoice,'playerShop');assert.equal(s.society.agents[4].memory.refusedPrice,1100);
  tickSociety(s,15);assert.ok(s.sales>0);assert.ok(s.society.trades.some(t=>t.venue==='kiosk'&&t.actorId==='resident-4'));
  assert.ok(s.society.agents[4].memory.lastReason.length>0);assert.deepEqual(validateSociety(s.society),s.society);
});

test('expensive stock remains unsold while an affordable competitor earns a real customer payment',()=>{
  const s=player({price:1100}),beforeCash=cash(s),beforeGoods=goods(s),money=s.money;
  tickSociety(s,40);assert.equal(s.sales,0);assert.equal(s.stock,12);assert.equal(s.money,money);
  const trade=s.society.trades.find(t=>t.venue==='competitor');assert.ok(trade);assert.deepEqual([trade.actorX,trade.actorZ],[-15,0]);assert.equal(trade.total,600);assert.equal(trade.playerMoneyAfter,trade.playerMoneyBefore);assert.equal(trade.actorWalletBefore-trade.actorWalletAfter,600);
  assert.ok(s.society.competitor.wallet>=600);assert.equal(cash(s),beforeCash);assert.equal(goods(s),beforeGoods);
});

test('fixed-step results do not depend on render partitions or a reload during a Running route',()=>{
  const coarse=player(),fine=player();tickSociety(coarse,60.125);for(let i=0;i<480;i++)tickSociety(fine,.125);tickSociety(fine,.125);assert.deepEqual(coarse,fine);
  const decimalCoarse=player(),decimalFine=player();tickSociety(decimalCoarse,60.13);for(let i=0;i<600;i++)tickSociety(decimalFine,.1);tickSociety(decimalFine,.13);assert.deepEqual(decimalCoarse,decimalFine);
  const resumed=player(),continuous=player();tickSociety(resumed,10.125);tickSociety(continuous,10.125);assert.equal(resumed.society.accumulator,.125);
  assert.ok(resumed.society.agents.some(a=>a.blackboard.status===BT_STATUS.Running&&a.state==='walk'));
  const saved=copy(resumed);resumed.society=validateSociety(saved.society);assert.ok(resumed.society);tickSociety(resumed,49.875);tickSociety(continuous,49.875);assert.deepEqual(resumed,continuous);
});

test('finite stock and finite employer cash remain conserved across daily routines',()=>{
  const s=player({stock:0,biz:false}),beforeCash=cash(s),beforeGoods=goods(s);s.society.supplier.stock=10;
  const adjustedGoods=goods(s);tickSociety(s,1200);assert.ok(s.society.ticks>240);assert.equal(cash(s),beforeCash);assert.equal(goods(s),adjustedGoods);assert.ok(s.society.ledger.wages>0);assert.ok(s.society.ledger.supplierProcurement>0);assert.ok(s.society.upstream.stock<192);assert.ok(validateSociety(s.society));
  assert.ok(beforeGoods>adjustedGoods);
});

test('malformed society saves, illegal routes and inconsistent transaction balances reject atomically',()=>{
  const s=player();negotiateSupplier(s,{price:300,quantity:4});buySupplier(s,4);tickSociety(s,10);const saved=copy(s.society);
  const mutations=[x=>x.version=2,x=>x.accumulator=.25,x=>x.agents.pop(),x=>x.agents[1].wallet=Infinity,x=>x.agents[1].inventory=13,x=>x.agents[1].blackboard.route=[0,14],x=>x.agents[1].blackboard.scores.work=9,x=>x.agents[1].memory.lastReason='x'.repeat(201),x=>x.agents[0].x=-40,x=>x.agents[0].state='walk',x=>x.agents[0].blackboard.goal='work',x=>x.agents[1].x=-17,x=>x.supplier.trust=-1,x=>x.supplier.quote={quantity:4,unitPrice:1,expiresAt:x.ticks+1},x=>x.trades[0].playerMoneyAfter++,x=>x.trades[0].stockAfter++,x=>x.trades[0].actorX=0];
  for(const mutate of mutations){const bad=copy(saved);mutate(bad);const before=copy(bad);assert.equal(validateSociety(bad),null);assert.deepEqual(bad,before);}
  assert.deepEqual(validateSociety(saved),saved);assert.equal(validateSociety(null),null);
});

test('invalid elapsed time never mutates the world and valid fractional time is retained',()=>{
  const s=player();for(const dt of [NaN,Infinity,-1,0,1201]){const before=copy(s);assert.deepEqual(tickSociety(s,dt),[]);assert.deepEqual(s,before);}
  tickSociety(s,.1);assert.equal(s.society.ticks,0);assert.equal(s.society.accumulator,.1);tickSociety(s,.15);assert.equal(s.society.ticks,1);assert.equal(s.society.accumulator,0);
});

test('every society sidewalk edge and distinct spawn clear the actual static world colliders',async()=>{
  const {buildWorld}=await import('../src/world.js'),{blocked}=await import('../src/controller.js'),THREE=await import('../vendor/three.module.js');
  const priorDocument=globalThis.document,ctx=new Proxy({}, {get:(obj,key)=>obj[key]??(()=>{}),set:(obj,key,value)=>(obj[key]=value,true)});
  globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
  let world;
  try{
    world=buildWorld(new THREE.Scene());
    // The authored southern crossing is not a dynamic traffic-yield simulation.
    // Exclude only the two moving cars, retaining the parked taxi and every wall.
    const staticColliders=world.colliders.filter(c=>c.x!==2.7&&c.x!==-2.7);
    for(const [from,to] of SOCIETY.links){
      const a=SOCIETY.nodes[from],b=SOCIETY.nodes[to],count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.1);
      for(let i=0;i<=count;i++){const t=i/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;assert.equal(blocked(x,z,staticColliders,.32),false,`society edge ${from}→${to} blocked at ${x},${z}`);}
    }
    for(const a of createSociety().agents)assert.equal(blocked(a.x,a.z,staticColliders,.32),false,`spawn ${a.id} blocked`);
  }finally{world?.dispose();globalThis.document=priorDocument;}
});
