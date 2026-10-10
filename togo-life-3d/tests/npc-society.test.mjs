import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import {createResidents} from '../src/npcs.js';

function resident(index,changes={}) {
 return {
  id:`resident-${index}`,name:['Ama','Kodjo','Abla','Sena','Koffi','Yawa','Mensah','Akossiwa'][index],
  job:index===0?'fournisseuse':'artisan',role:index===0?'supplier':'client',
  x:index===0?-10:-7,z:index===0?1:index*3-15,heading:Math.PI/2,
  speed:0,state:index===0?'sell':'work',visits:index+2,
  appearance:{shirt:'#247c7a',skin:'#633f2e',trousers:'#223f45',scale:.96},
  ...changes,
 };
}
function freezeTree(value) {
 if(value&&typeof value==='object'){
  for(const child of Object.values(value))freezeTree(child);
  Object.freeze(value);
 }
 return value;
}

test('society renders the eight persisted people, with an anchored supplier and no second economic clock',()=>{
 const scene=new THREE.Scene();
 const society=freezeTree({agents:Array.from({length:8},(_,index)=>resident(index)),market:{cash:17000,stock:30}});
 const before=JSON.stringify(society),residents=createResidents(scene,{getSociety:()=>society});
 assert.equal(scene.children.length,8);
 assert.deepEqual(residents.people.map(person=>person.id),society.agents.map(agent=>agent.id));
 // A player standing beside Ama must not push a stationary shopkeeper away.
 for(let i=0;i<120;i++)residents.update(1/60,13,{x:-10,z:1});
 const ama=residents.people.find(person=>person.id==='resident-0');
 assert.equal(ama.name,'Ama');assert.equal(ama.job,'fournisseuse');assert.equal(ama.role,'supplier');
 assert.deepEqual([ama.character.group.position.x,ama.character.group.position.z],[-10,1]);
 assert.equal(ama.state,'sell');assert.equal(ama.visits,2);assert.equal(ama.character.animationState,'Idle');
 assert.equal(JSON.stringify(society),before,'rendering changed economic or navigation state');
 residents.dispose();assert.equal(scene.children.length,0);
});

test('loading a different saved society updates the same identities, exact positions and locomotion',()=>{
 const scene=new THREE.Scene();let society={agents:[resident(0),resident(1)]};
 const residents=createResidents(scene,()=>society);
 const originalAma=residents.people[0].character,originalKodjo=residents.people[1].character;
 // Replacement, order changes and saved visits must not resurrect legacy residents.
 society=JSON.parse(JSON.stringify({agents:[
  resident(1,{x:-13,z:25,heading:-.6,speed:1.2,state:'walk',visits:9}),
  resident(0,{name:'Ama du marché',visits:12}),
 ]}));
 residents.update(1/60,21,{x:-13,z:25});
 assert.equal(scene.children.length,2);
 const kodjo=residents.people.find(person=>person.id==='resident-1'),ama=residents.people.find(person=>person.id==='resident-0');
 assert.equal(ama.character,originalAma);assert.equal(kodjo.character,originalKodjo);
 assert.deepEqual([kodjo.character.group.position.x,kodjo.character.group.position.z],[-13,25]);
 assert.equal(kodjo.character.group.rotation.y,-.6);assert.equal(kodjo.character.animationState,'Walk');
 assert.equal(kodjo.visits,9);assert.equal(ama.visits,12);assert.equal(ama.name,'Ama du marché');
 society.agents[0].speed=0;society.agents[0].state='buy';residents.update(1/60);
 assert.equal(kodjo.character.animationState,'Idle');assert.equal(kodjo.state,'buy');
 residents.dispose();assert.equal(scene.children.length,0);
});

test('missing or removed society residents produce no duplicate or invisible fallback agents',()=>{
 const scene=new THREE.Scene();let society;
 const residents=createResidents(scene,{getSociety:()=>society});
 assert.equal(residents.people.length,0);assert.equal(scene.children.length,0);
 society={agents:[resident(0),resident(0,{name:'duplicate'}),resident(1,{x:NaN})]};residents.update(1/60);
 assert.equal(residents.people.length,1);assert.equal(scene.children.length,1);
 const removed=residents.people[0].character;
 society={agents:[]};residents.update(1/60);
 assert.equal(residents.people.length,0);assert.equal(scene.children.length,0);assert.equal(removed.group.parent,null);
 residents.dispose();residents.dispose();society={agents:[resident(0)]};residents.update(1/60);
 assert.equal(scene.children.length,0,'disposed rendering adapter revived residents');
});

test('a saved clothing change disposes the old model and retains one visible character',()=>{
 const scene=new THREE.Scene();let society={agents:[resident(0)]};
 const residents=createResidents(scene,()=>society),old=residents.people[0].character;
 society=JSON.parse(JSON.stringify(society));society.agents[0].appearance.shirt='#d5ac57';
 society.agents[0].appearance.scale=1.04;residents.update(1/60);
 const current=residents.people[0].character;
 assert.notEqual(current,old);assert.equal(old.group.parent,null);assert.equal(scene.children.length,1);
 assert.equal(current.group.scale.x,1.04);
 assert.deepEqual([current.group.position.x,current.group.position.z],[-10,1]);
 residents.dispose();
});

test('4 Hz motion is interpolated for display while economic proximity retains the authoritative endpoint',()=>{
 const scene=new THREE.Scene(),society={ticks:5,version:1,agents:[resident(1,{x:-7,z:24,heading:Math.PI-.1,state:'walk',speed:1.2})]};
 const residents=createResidents(scene,()=>society),person=residents.people[0];
 society.ticks++;society.agents[0].x=-7.3;society.agents[0].heading=-Math.PI+.1;
 residents.update(.125);
 assert.equal(person.authoritativePosition.x,-7.3);assert.equal(person.authoritativePosition.z,24);
 assert.equal(person.sourceAgent,society.agents[0]);
 assert.ok(person.character.group.position.x<-7&&person.character.group.position.x>-7.3,'display teleported instead of interpolating');
 assert.ok(Math.abs(Math.abs(person.character.group.rotation.y)-Math.PI)<.01,'turn used the long arc');
 residents.update(.125);
 assert.equal(person.character.group.position.x,-7.3);
 assert.equal(person.character.group.position.z,24);
 // Stationary work uses Idle even though the agent retains its maximum speed.
 society.agents[0].state='work';residents.update(1/60);
 assert.equal(person.character.animationState,'Idle');
 society.ticks=0;society.agents[0].x=-13;society.agents[0].z=25;residents.update(1/60);
 assert.deepEqual([person.character.group.position.x,person.character.group.position.z],[-13,25],'clock reset failed to snap restored position');
 residents.dispose();
});
