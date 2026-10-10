import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation, createState, levelFor, capacityFor, destinationFor, dayEvent, DESTINATIONS, DAY_EVENTS } from '../src/simulation.js';
import { actionReason, goalFor, levelView, nextContract } from '../src/ui-model.js';
const at=location=>({location});
const nextDay=s=>{const day=s.state.day;while(s.state.day===day)s.tick(60);};

test('levels unlock real perks enforced by the simulation',()=>{
 assert.deepEqual([0,11,12,34,35,69,70,500].map(levelFor),[1,1,2,2,3,3,4,4]);
 const s=new Simulation();assert.equal(s.act({type:'buy',quantity:16},at('market')).ok,false);
 s.state.experience=12;assert.equal(capacityFor(s.state),16);assert.equal(actionReason(s.state,'buy',{quantity:16}),'');
 assert.equal(s.act({type:'buy',quantity:16},at('market')).ok,true);assert.equal(s.state.carried,16);
 assert.equal(levelView(s.state).next.level,3);
});

test('delivering grants experience and announces level-ups in the journal',()=>{
 const s=new Simulation();s.state.experience=10;s.act('contract',at('market'));s.act('deliver',at('studio'));
 assert.equal(s.state.experience,14);assert.ok(s.state.events.some(e=>/Niveau 2/.test(e)));
});

test('day one is the guided studio delivery, later days rotate real destinations',()=>{
 assert.equal(destinationFor(1),'studio');assert.equal(dayEvent(1).id,'calm');
 const seen=new Set();for(let d=2;d<40;d++){seen.add(destinationFor(d));assert.ok(DESTINATIONS[destinationFor(d)]);}
 assert.equal(seen.size,3);
 const events=new Set();for(let d=2;d<40;d++)events.add(dayEvent(d).id);assert.equal(events.size,DAY_EVENTS.length);
});

test('a delivery must reach its own destination and pays the destination reward',()=>{
 const s=new Simulation();let day=2;while(destinationFor(day)!=='cafe')day++;
 while(s.state.day<day)nextDay(s);s.state.debt=0;
 assert.equal(nextContract(s.state).destination,'cafe');
 assert.equal(s.act('contract',at('market')).ok,true);assert.equal(goalFor(s.state).targetId,'cafe');
 const before=s.state.money;assert.equal(s.act('deliver',at('studio')).ok,false);
 assert.equal(s.act('deliver',at('cafe')).ok,true);assert.equal(s.state.money-before,1800);
});

test('level 3 raises rewards and level 4 allows two deliveries per day',()=>{
 const s=new Simulation();s.state.experience=35;s.act('contract',at('market'));assert.equal(s.state.contract.reward,1500);s.act('deliver',at('studio'));
 assert.equal(s.act('contract',at('market')).ok,false);
 s.state.experience=70;assert.equal(s.act('contract',at('market')).ok,true);s.act('deliver',at(s.state.contract.destination));
 assert.equal(s.act('contract',at('market')).ok,false);assert.equal(s.state.dailyContracts,2);
});

test('daily events change customer frequency only',()=>{
 let busy=2;while(dayEvent(busy).id!=='festival')busy++;let quiet=2;while(dayEvent(quiet).id!=='rain')quiet++;
 const sales=day=>{const s=new Simulation();Object.assign(s.state,{day,time:8,biz:true,stock:40,price:450});s.tick(60);return s.state.sales;};
 assert.ok(sales(busy)>sales(1));assert.ok(sales(quiet)<sales(1));
});

test('version 2 saves migrate and version 3 saves roundtrip strictly',()=>{
 const v2={...createState(),version:2,lastContractDay:1,contract:{origin:'market',destination:'studio',deadline:2,reward:1200}};delete v2.dailyContracts;
 const s=new Simulation();assert.equal(s.load(v2),true);assert.equal(s.state.dailyContracts,1);assert.equal(s.act('contract',at('market')).ok,false);
 assert.equal(new Simulation().load({...v2,contract:{...v2.contract,destination:'cafe',reward:1800}}),false);
 const v3={...createState(),contract:{origin:'market',destination:'pharmacy',deadline:2,reward:1500},dailyContracts:1,lastContractDay:1};
 assert.equal(new Simulation().load(v3),true);
 for(const bad of [{...v3,dailyContracts:3},{...v3,dailyContracts:undefined},{...v3,contract:{...v3.contract,reward:9999}},{...v3,contract:{...v3.contract,destination:'bank'}},{...v3,carried:16}])assert.equal(new Simulation().load(bad),false);
 assert.equal(new Simulation().load({...v3,experience:12,carried:16}),true);
});
