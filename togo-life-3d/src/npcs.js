import {createCharacter} from './character.js';
import {angleTowards} from './controller.js';
// Authored graph: sidewalks and a single crossing at the southern cross street.
const nodes=[[-7,-18],[-7,-7],[-7,1],[-10,1],[-7,12],[-7,23],[-7,29],[7,29],[7,23],[7,6],[7,-7],[7,-18]];
const links=[[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11]];
const adjacency=nodes.map(()=>[]);for(const [a,b]of links){adjacency[a].push(b);adjacency[b].push(a);}
function path(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const p=queue.shift(),last=p.at(-1);if(last===to)return p;for(const next of adjacency[last])if(!seen.has(next)){seen.add(next);queue.push([...p,next]);}}return [from];}
function nearestNode(pos){let best=0,d=Infinity;nodes.forEach(([x,z],i)=>{const n=(x-pos.x)**2+(z-pos.z)**2;if(n<d){d=n;best=i;}});return best;}
function createScheduledResidents(scene){const names=['Ama','Kodjo','Abla','Sena','Koffi','Yawa','Mensah','Akossiwa'];
 const starts=[0,1,2,3,5,6,8,10];
 const people=names.map((name,i)=>{const c=createCharacter({shirt:['#b9563e','#247c7a','#d5ac57','#dbcdb5'][i%4],skin:i%2?'#936044':'#633f2e',trousers:i%2?'#4b4546':'#223f45',scale:i%2?.96:1});scene.add(c.group);const start=nodes[starts[i]];c.group.position.set(start[0],.24,start[1]);return {id:'resident-'+i,name,character:c,index:i,route:[],purpose:null,state:'idle',speed:1+(i%3)*.15,visits:0,job:i%4===0?'vendeuse':i%4===1?'artisan':i%4===2?'commerçante':'étudiant'};});
 function update(dt,time,playerPosition=null){for(const p of people){const h=(time+p.index*.12)%24,purpose=h<7||h>=19?'home':h<10?'buy':h<16?'work':h<18?'waitTaxi':'talk';const target=purpose==='home'?(p.index%2?8:5):purpose==='buy'?3:purpose==='work'?(p.index%2?10:1):purpose==='waitTaxi'?9:4;
 if(p.purpose!==purpose){p.purpose=purpose;p.route=path(nearestNode(p.character.group.position),target);p.state='walk';}
 const pos=p.character.group.position,node=p.route[0];if(node===undefined){p.state=purpose;p.character.update(dt,0);continue;}
 const base=nodes[node],last=p.route.length===1;
 const x=base[0]+(last?(p.index%4-1.5)*.6:(p.index%2?-.32:.32)),z=base[1]+(last?(Math.floor(p.index/4)-.5)*.7:0),dx=x-pos.x,dz=z-pos.z,d=Math.hypot(dx,dz);if(d<.10){p.route.shift();if(!p.route.length){p.state=purpose;p.visits++;}p.character.update(dt,0);continue;}
 p.state='walk';const step=Math.min(d,p.speed*dt);pos.x+=dx/d*step;pos.z+=dz/d*step;p.character.group.rotation.y=angleTowards(p.character.group.rotation.y,Math.atan2(dx,dz),dt);p.character.update(dt,p.speed);
 }
 // Small continuous steering corrections prevent bodies occupying the same spot.
 for(let i=0;i<people.length;i++){const a=people[i].character.group.position;
  for(let j=i+1;j<people.length;j++){const b=people[j].character.group.position,dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz);if(d<.62){const force=Math.min(.03,(.62-d)*dt*3),nx=d>.001?dx/d:1,nz=d>.001?dz/d:0;a.x+=nx*force;a.z+=nz*force;b.x-=nx*force;b.z-=nz*force;}}
  if(playerPosition){const dx=a.x-playerPosition.x,dz=a.z-playerPosition.z,d=Math.hypot(dx,dz);if(d<.8){const force=Math.min(.04,(.8-d)*dt*4);a.x+=(d>.001?dx/d:1)*force;a.z+=(d>.001?dz/d:0)*force;}}
 }
 }return {people,update,dispose(){people.forEach(p=>{scene.remove(p.character.group);p.character.dispose();});}};
}

const SHIRTS=['#b9563e','#247c7a','#d5ac57','#dbcdb5'];
function appearanceFor(agent,index){
 const appearance=agent.appearance??{};
 return {
  shirt:appearance.shirt??SHIRTS[index%SHIRTS.length],
  skin:appearance.skin??(index%2?'#936044':'#633f2e'),
  trousers:appearance.trousers??(index%2?'#4b4546':'#223f45'),
  hair:appearance.hair??'#171211',
  scale:Number.isFinite(appearance.scale)?Math.max(.8,Math.min(1.15,appearance.scale)):(index%2?.96:1)
 };
}

/** Render the simulation's residents, without a second navigation/economy loop.
 * A provider follows state replacements when a save is loaded. Omitting it keeps
 * the original authored routines for standalone scenes and existing callers.
 * Passing a provider whose society is empty renders no hidden fallback actors.
 */
export function createResidents(scene,source=null){
 const getSociety=typeof source==='function'?source:
  typeof source?.getSociety==='function'?source.getSociety:
  Array.isArray(source?.agents)?()=>source:null;
 if(!getSociety)return createScheduledResidents(scene);
 const people=[],byId=new Map(),seen=new Set();
 let disposed=false,lastSociety=null,lastTicks=null,lastVersion=null;
 function snap(person,x,z,heading){
  person.presentation={fromX:x,fromZ:z,fromHeading:heading,x,z,heading,elapsed:.25};
  person.character.group.position.set(x,.24,z);person.character.group.rotation.y=heading;
 }
 function remove(person){scene.remove(person.character.group);person.character.dispose();byId.delete(person.id);}
 function sync(dt=0){
  if(disposed)return;
  const society=getSociety(),agents=Array.isArray(society?.agents)?society.agents:[];
  const ticks=Number.isFinite(society?.ticks)?society.ticks:null;
  const reset=society!==lastSociety||society?.version!==lastVersion||
   (ticks!==null&&lastTicks!==null&&ticks<lastTicks);
  const renderDt=Number.isFinite(dt)?Math.max(0,dt):0;
  seen.clear();people.length=0;
  for(let index=0;index<agents.length;index++){
   const agent=agents[index],x=agent?.x??agent?.position?.x,z=agent?.z??agent?.position?.z;
   if(typeof agent?.id!=='string'||!agent.id||seen.has(agent.id)||!Number.isFinite(x)||!Number.isFinite(z))continue;
   seen.add(agent.id);
   let person=byId.get(agent.id),appearanceChanged=false;
   const appearance=appearanceFor(agent,index),appearanceKey=JSON.stringify(appearance);
   if(!person){
    person={id:agent.id,character:createCharacter(appearance),appearanceKey};
    byId.set(agent.id,person);scene.add(person.character.group);
   }else if(person.appearanceKey!==appearanceKey){
    scene.remove(person.character.group);person.character.dispose();
    person.character=createCharacter(appearance);person.appearanceKey=appearanceKey;appearanceChanged=true;scene.add(person.character.group);
   }
   const heading=Number.isFinite(agent.heading)?agent.heading:person.character.group.rotation.y;
   // Only presentation interpolates the 4 Hz simulation; proximity, purchases
   // and path arrivals use authoritativePosition/sourceAgent, never this lag.
   // Reloads and clock resets snap to the restored location without a long glide.
   person.authoritativePosition??={x,z};person.authoritativePosition.x=x;person.authoritativePosition.z=z;
   if(reset||!person.presentation||appearanceChanged)snap(person,x,z,heading);
   else{
    const presentation=person.presentation,group=person.character.group;
    if(presentation.x!==x||presentation.z!==z||presentation.heading!==heading){
     presentation.fromX=group.position.x;presentation.fromZ=group.position.z;
     presentation.fromHeading=group.rotation.y;
     presentation.x=x;presentation.z=z;presentation.heading=heading;presentation.elapsed=0;
    }
    presentation.elapsed=Math.min(.25,presentation.elapsed+renderDt);
    const t=presentation.elapsed/.25;
    group.position.set(presentation.fromX+(x-presentation.fromX)*t,.24,presentation.fromZ+(z-presentation.fromZ)*t);
    const angle=Math.atan2(Math.sin(heading-presentation.fromHeading),Math.cos(heading-presentation.fromHeading));
    group.rotation.y=presentation.fromHeading+angle*t;
   }
   person.name=agent.name??agent.id;person.job=agent.job??'habitant';
   person.index=index;person.role=agent.role??'client';person.state=agent.state??'idle';
   person.purpose=agent.purpose??person.state;person.visits=agent.visits??0;
   person.route=agent.route??[];person.sourceAgent=agent;person.agent=agent;
   person.speed=person.state==='walk'&&Number.isFinite(agent.speed)?Math.max(0,agent.speed):0;
   person.character.update(renderDt,person.speed);
   people.push(person);
  }
  for(const person of byId.values())if(!seen.has(person.id))remove(person);
  lastSociety=society;lastTicks=ticks;lastVersion=society?.version;
 }
 sync();
 return {people,update(dt){sync(dt);},dispose(){if(disposed)return;disposed=true;for(const person of byId.values())remove(person);people.length=0;}};
}
