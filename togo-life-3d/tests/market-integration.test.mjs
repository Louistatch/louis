import test from 'node:test';
import assert from 'node:assert/strict';
import {Simulation} from '../src/simulation.js';

const at=location=>({location});
const totalCash=state=>state.money+state.society.supplier.wallet+state.society.competitor.wallet+
 state.society.upstream.wallet+state.society.employer.wallet+
 state.society.agents.filter(agent=>agent.role==='client').reduce((sum,agent)=>sum+agent.wallet,0);
const totalGoods=state=>state.carried+state.stock+state.society.supplier.stock+state.society.competitor.stock+
 state.society.upstream.stock+state.society.ledger.consumed+
 state.society.agents.reduce((sum,agent)=>sum+agent.inventory+agent.householdFood,0);
function requireAction(simulation,action,location){
 const result=simulation.act(action,at(location));assert.equal(result.ok,true,result.message);return result;
}
function untilSale(simulation,seconds=60){
 const initial=simulation.state.sales;
 for(let i=0;i<seconds*4&&simulation.state.sales===initial;i++)simulation.tick(.25);
 assert.ok(simulation.state.sales>initial,'no identified customer completed an affordable purchase');
 return simulation.state.society.trades.findLast(trade=>trade.venue==='kiosk');
}

test('a refused negotiation changes persistent trust without transferring money or goods',()=>{
 const simulation=new Simulation(),before=simulation.snapshot(),cash=totalCash(before),goods=totalGoods(before);
 const rejected=simulation.act({type:'negotiate',price:150,quantity:4},at('market'));
 assert.equal(rejected.ok,false);assert.equal(rejected.accepted,false);
 assert.equal(simulation.state.money,before.money);assert.equal(totalCash(simulation.state),cash);assert.equal(totalGoods(simulation.state),goods);
 assert.equal(simulation.state.carried,0);assert.equal(simulation.state.society.supplier.trust,37);
 assert.equal(simulation.state.society.agents[0].relationship,37);
 assert.equal(simulation.state.society.supplier.lastDecision.kind,'rejected');
 assert.match(simulation.state.events.at(-1),/refuse/);
 const restored=new Simulation();assert.equal(restored.load(JSON.stringify(simulation.snapshot())),true);
 assert.deepEqual(restored.snapshot(),simulation.snapshot());
 assert.equal(restored.state.society.supplier.lastDecision.offeredPrice,150);
 assert.equal(restored.state.society.supplier.quote,null);
 const unavailable=restored.snapshot();
 assert.equal(restored.act({type:'negotiate',price:315,quantity:4},at('kiosk')).ok,false);
 assert.deepEqual(restored.snapshot(),unavailable,'a remote offer changed the supplier');
});

test('negotiated wholesale purchase, physical deposit and an arriving buyer conserve cash and goods',()=>{
 const original=new Simulation(),initialCash=totalCash(original.state),initialGoods=totalGoods(original.state);
 const quote=requireAction(original,{type:'negotiate',price:300,quantity:4},'market');
 assert.equal(quote.accepted,false);assert.equal(quote.counter,true);assert.equal(quote.unitPrice,315);
 assert.equal(original.state.money,15000);assert.equal(original.state.carried,0);
 // Reload the still-valid counteroffer before committing the purchase.
 const simulation=new Simulation();assert.equal(simulation.load(original.snapshot()),true);
 requireAction(simulation,{type:'buy',quantity:4},'market');
 assert.equal(simulation.state.money,13740);assert.equal(simulation.state.carried,4);
 assert.equal(simulation.state.carriedCost,1260);assert.equal(simulation.state.costs,1260);
 assert.equal(totalCash(simulation.state),initialCash);assert.equal(totalGoods(simulation.state),initialGoods);
 const wrongEndpoint=simulation.snapshot();
 assert.equal(simulation.act('deposit',at('market')).ok,false);assert.deepEqual(simulation.snapshot(),wrongEndpoint);
 requireAction(simulation,'invest','kiosk');assert.equal(simulation.state.money,4740);
 assert.equal(simulation.state.stock,0,'buying a business silently supplied stock');
 requireAction(simulation,'deposit','kiosk');requireAction(simulation,{type:'price',price:450},'kiosk');
 assert.equal(simulation.state.stock,4);assert.equal(simulation.state.stockCost,1260);
 assert.equal(simulation.state.carried,0);assert.equal(simulation.state.carriedCost,0);
 const relationships=new Map(simulation.state.society.agents.map(agent=>[agent.id,agent.relationship]));
 simulation.tick(1);assert.equal(simulation.state.sales,0);
 assert.ok(simulation.state.society.agents.some(agent=>agent.state==='walk'&&agent.blackboard.goal==='playerShop'));
 const trade=untilSale(simulation),buyer=simulation.state.society.agents.find(agent=>agent.id===trade.buyerId);
 assert.ok(buyer&&buyer.role==='client');assert.equal(trade.actorId,buyer.id);
 assert.ok(Math.hypot(trade.actorX+13,trade.actorZ-25)<=.55);
 assert.equal(trade.actorWalletBefore-trade.actorWalletAfter,450);assert.equal(trade.playerMoneyAfter-trade.playerMoneyBefore,450);
 assert.equal(trade.quantity,1);assert.equal(trade.stockBefore-trade.stockAfter,1);assert.equal(trade.costBasis,315);
 assert.equal(simulation.state.money,5190);assert.equal(simulation.state.revenue,450);assert.equal(simulation.state.experience,1);
 assert.equal(simulation.state.rep,0,'one sale granted the five-sale reputation milestone');
 assert.equal(buyer.relationship,relationships.get(buyer.id)+4);
 assert.equal(simulation.state.goodsCostSold,315);assert.equal(simulation.state.stockCost,945);
 assert.equal(totalCash(simulation.state),initialCash-9000,'customer or supplier created currency');
 assert.equal(totalGoods(simulation.state),initialGoods,'stock disappeared without inventory/consumption');
 const restored=new Simulation();assert.equal(restored.load(simulation.snapshot()),true);assert.deepEqual(restored.snapshot(),simulation.snapshot());
});

test('mixed-price parcels retain weighted inventory cost when deposited and sold',()=>{
 const simulation=new Simulation();
 requireAction(simulation,{type:'negotiate',price:300,quantity:4},'market');
 requireAction(simulation,{type:'buy',quantity:4},'market');requireAction(simulation,'invest','kiosk');requireAction(simulation,'deposit','kiosk');
 // The first quote was consumed. A second parcel is bought at the standard rate.
 requireAction(simulation,{type:'buy',quantity:4},'market');assert.equal(simulation.state.carriedCost,1400);
 requireAction(simulation,'deposit','kiosk');assert.equal(simulation.state.stock,8);assert.equal(simulation.state.stockCost,2660);
 requireAction(simulation,{type:'price',price:450},'kiosk');const trade=untilSale(simulation);
 assert.equal(trade.costBasis,332.5);assert.equal(simulation.state.goodsCostSold,332.5);assert.equal(simulation.state.stockCost,2327.5);
 assert.equal(simulation.state.stockCost+simulation.state.goodsCostSold,2660);
 const restored=new Simulation();assert.equal(restored.load(simulation.snapshot()),true);assert.equal(restored.state.stockCost,2327.5);
});

test('five paid customer visits unlock reputation rather than waiting out a sales timer',()=>{
 const simulation=new Simulation();requireAction(simulation,{type:'buy',quantity:12},'market');
 requireAction(simulation,'invest','kiosk');requireAction(simulation,'deposit','kiosk');requireAction(simulation,{type:'price',price:450},'kiosk');
 simulation.tick(60);assert.ok(simulation.state.sales>0&&simulation.state.sales<5);assert.equal(simulation.state.rep,0);
 for(let i=0;i<720*4&&simulation.state.sales<5;i++)simulation.tick(.25);
 assert.ok(simulation.state.sales>=5,'resident routines never brought the fifth paying customer');
 const receipts=simulation.state.society.trades.filter(trade=>trade.venue==='kiosk');
 assert.equal(receipts.length,simulation.state.sales);
 assert.ok(receipts.every(trade=>trade.actorWalletBefore-trade.actorWalletAfter===450));
 assert.ok(receipts.every(trade=>Math.hypot(trade.actorX+13,trade.actorZ-25)<=.55));
 assert.equal(simulation.state.rep,1);assert.equal(simulation.state.experience,simulation.state.sales);
});

test('an unaffordable price sends a real buyer elsewhere and refusal memory survives a save',()=>{
 const simulation=new Simulation();requireAction(simulation,{type:'buy',quantity:4},'market');
 requireAction(simulation,'invest','kiosk');requireAction(simulation,'deposit','kiosk');requireAction(simulation,{type:'price',price:1100},'kiosk');
 const cash=totalCash(simulation.state),goods=totalGoods(simulation.state),money=simulation.state.money;
 simulation.tick(40);
 assert.equal(simulation.state.sales,0);assert.equal(simulation.state.stock,4);assert.equal(simulation.state.money,money);
 const competingTrade=simulation.state.society.trades.find(trade=>trade.venue==='competitor');
 assert.ok(competingTrade,'no actual competing purchase followed the price refusal');
 assert.equal(competingTrade.unitPrice,600);assert.equal(competingTrade.actorWalletBefore-competingTrade.actorWalletAfter,600);
 assert.equal(competingTrade.playerMoneyBefore,competingTrade.playerMoneyAfter);
 assert.ok(Math.hypot(competingTrade.actorX+15,competingTrade.actorZ)<=.55);
 assert.equal(totalCash(simulation.state),cash);assert.equal(totalGoods(simulation.state),goods);
 const refused=simulation.state.society.agents.filter(agent=>agent.memory.refusedPrice===1100);
 assert.ok(refused.length>0);const saved=simulation.snapshot(),restored=new Simulation();assert.equal(restored.load(JSON.stringify(saved)),true);
 for(const agent of refused){const remembered=restored.state.society.agents.find(candidate=>candidate.id===agent.id);assert.deepEqual(remembered.memory,agent.memory);}
 requireAction(restored,{type:'price',price:450},'kiosk');const trade=untilSale(restored);
 assert.equal(trade.unitPrice,450);assert.equal(restored.state.society.agents.find(agent=>agent.id===trade.actorId).memory.refusedPrice,1100);
 assert.equal(totalCash(restored.state),cash);assert.equal(totalGoods(restored.state),goods);
});

test('Simulation fixed steps and a reload during travel produce the same economy and resident decisions',()=>{
 const setup=()=>{const simulation=new Simulation();requireAction(simulation,{type:'negotiate',price:300,quantity:4},'market');
  requireAction(simulation,{type:'buy',quantity:4},'market');requireAction(simulation,'invest','kiosk');requireAction(simulation,'deposit','kiosk');
  requireAction(simulation,{type:'price',price:450},'kiosk');return simulation;};
 const coarse=setup(),fine=setup();coarse.tick(60.125);for(let i=0;i<481;i++)fine.tick(.125);
 assert.deepEqual(coarse.snapshot(),fine.snapshot());assert.equal(coarse.state.stepRemainder,.125);
 const uninterrupted=setup(),original=setup();uninterrupted.tick(10.125);original.tick(10.125);
 assert.ok(original.state.society.agents.some(agent=>agent.state==='walk'&&agent.blackboard.status==='Running'));
 const resumed=new Simulation();assert.equal(resumed.load(JSON.stringify(original.snapshot())),true);
 resumed.tick(49.875);uninterrupted.tick(49.875);assert.deepEqual(resumed.snapshot(),uninterrupted.snapshot());
 assert.equal(resumed.state.stepRemainder,0);assert.equal(resumed.state.society.ticks,240);
});

test('talking with the supplier preserves a synchronized relationship that can be saved and restored',()=>{
 const simulation=new Simulation(),supplier=simulation.state.society.supplier,ama=simulation.state.society.agents[0];
 assert.equal(simulation.act('talk',{npcId:'resident-0'}).ok,true);
 assert.equal(ama.relationship,43);assert.equal(supplier.trust,43);
 assert.match(ama.memory.lastReason,/discuter/);
 const saved=simulation.snapshot(),restored=new Simulation();assert.equal(restored.load(JSON.stringify(saved)),true);
 assert.deepEqual(restored.snapshot(),saved);
 assert.equal(restored.state.society.agents[0].relationship,restored.state.society.supplier.trust);
 assert.equal(restored.act('talk',{npcId:'resident-0'}).ok,false);
 assert.equal(restored.state.society.supplier.trust,43,'repeating a conversation farmed trust');
});

test('the exact midnight boundary advances both clocks and charges rent once',()=>{
 const simulation=new Simulation();simulation.tick(480);
 assert.equal(simulation.state.day,2);assert.equal(simulation.state.time,0);
 assert.equal(simulation.state.debt,800);assert.equal(simulation.state.money,15000);
 const society=simulation.state.society,absoluteHours=society.startTime+society.ticks*.25/30;
 assert.equal(society.startDay+Math.floor(absoluteHours/24),simulation.state.day);
 assert.equal(absoluteHours%24,simulation.state.time);assert.equal(society.supplier.lastDay,2);
 assert.equal(simulation.state.events.filter(message=>message.startsWith('Loyer quotidien')).length,1);
 simulation.tick(.25);assert.equal(simulation.state.debt,800,'the first post-midnight step charged rent twice');
 const restored=new Simulation();assert.equal(restored.load(simulation.snapshot()),true);
 assert.deepEqual(restored.snapshot(),simulation.snapshot());
});

test('decimal elapsed-time partitions preserve exactly the same fractional save state',()=>{
 const coarse=new Simulation(),partitioned=new Simulation();coarse.tick(.3);partitioned.tick(.2);partitioned.tick(.1);
 assert.equal(coarse.state.stepRemainder,.05);assert.equal(partitioned.state.stepRemainder,.05);
 assert.equal(coarse.state.society.ticks,1);assert.deepEqual(coarse.snapshot(),partitioned.snapshot());
 const restored=new Simulation();assert.equal(restored.load(JSON.stringify(partitioned.snapshot())),true);
 coarse.tick(.2);restored.tick(.2);
 assert.equal(restored.state.stepRemainder,0);assert.equal(restored.state.society.ticks,2);
 assert.deepEqual(restored.snapshot(),coarse.snapshot());
});
