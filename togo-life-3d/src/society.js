/**
 * Deterministic, engine-neutral neighbourhood economy. Virtual CFA only.
 * Hybrid AI: a reactive behaviour tree interrupts commitments for urgent needs;
 * normalized utility scores choose a destination. All motion, quotes and memory
 * are serializable. No render state, wall clock, random source or network input.
 */
export const BT_STATUS = Object.freeze({Success:'Success', Failure:'Failure', Running:'Running'});
const STEP=.25, CAPACITY=12, WHOLESALE=350;
const nodes=[[-7,-18],[-7,-7],[-7,1],[-10,1],[-7,12],[-7,23],[-7,29],[7,29],[7,23],[7,6],[7,-7],[7,-18],[-15,0],[-7,25],[-13,25],[-7,-6],[-17,-6],[16,29],[16,23]];
const links=[[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[3,12],[5,13],[13,14],[1,15],[15,16],[7,17],[17,18]];
const adjacency=nodes.map(()=>[]);
for(const [a,b] of links){adjacency[a].push(b);adjacency[b].push(a);}
// Precomputed once. Replanning happens only when the intention changes.
const paths=nodes.map((_,from)=>nodes.map((__,to)=>{
  const queue=[[from]],seen=new Set([from]);
  for(let cursor=0;cursor<queue.length;cursor++){
    const route=queue[cursor],last=route.at(-1);if(last===to)return Object.freeze(route);
    for(const next of adjacency[last])if(!seen.has(next)){seen.add(next);queue.push([...route,next]);}
  }
  return Object.freeze([]);
}));
export const SOCIETY=Object.freeze({step:STEP,wholesale:WHOLESALE,capacity:CAPACITY,nodes:Object.freeze(nodes.map(p=>Object.freeze([...p]))),links:Object.freeze(links.map(p=>Object.freeze([...p]))),anchors:Object.freeze({market:3,competitor:12,kiosk:14,studio:16,home:18,taxi:9})});
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const clone=value=>JSON.parse(JSON.stringify(value));
const profiles=[
  {name:'Ama',job:'fournisseuse',role:'supplier',start:3,home:5,work:3,wallet:0,food:75,energy:80,maxPrice:350,preference:1,speed:0,wage:0},
  {name:'Kodjo',job:'artisan',start:5,home:18,work:16,wallet:900,food:28,energy:76,maxPrice:450,preference:.9,speed:1.1,wage:450},
  {name:'Abla',job:'couturière',start:2,home:5,work:16,wallet:2400,food:35,energy:72,maxPrice:700,preference:.75,speed:1.25,wage:600},
  {name:'Sena',job:'étudiante',start:8,home:18,work:10,wallet:1100,food:45,energy:86,maxPrice:550,preference:.65,speed:1.4,wage:300},
  {name:'Koffi',job:'chauffeur',start:13,home:8,work:9,wallet:1400,food:30,energy:62,maxPrice:450,preference:.95,speed:1.3,wage:500},
  {name:'Yawa',job:'commerçante',start:6,home:5,work:1,wallet:3000,food:32,energy:68,maxPrice:1000,preference:.35,speed:1.2,wage:700},
  {name:'Mensah',job:'technicien',start:11,home:18,work:11,wallet:1800,food:55,energy:70,maxPrice:800,preference:.7,speed:1.35,wage:650},
  {name:'Akossiwa',job:'apprentie',start:10,home:5,work:16,wallet:800,food:38,energy:81,maxPrice:600,preference:.8,speed:1.15,wage:350}
];
const goals=['playerShop','competitor','work','home','taxi'];
const states=['idle','walk','work','home','buy','sell','waitTaxi','talk'];
/** Budget eligibility only; never a promise of a visit or a transaction. */
export function customerCanAfford(agent,price){return agent?.role==='client'&&Number.isInteger(price)&&price>0&&price<=agent.maxPrice&&price<=agent.wallet;}
export function createSociety({day=1,time=8}={}){
  const agents=profiles.map((p,i)=>({id:'resident-'+i,name:p.name,job:p.job,role:p.role||'client',x:nodes[p.start][0],z:nodes[p.start][1],heading:0,speed:p.speed,state:i?'idle':'sell',visits:0,
    appearance:{shirt:['#b9563e','#247c7a','#d5ac57','#dbcdb5'][i%4],skin:i%2?'#936044':'#633f2e',trousers:i%2?'#4b4546':'#223f45',scale:i%2?.96:1},
    wallet:p.wallet,inventory:0,householdFood:0,food:p.food,energy:p.energy,relationship:i?20:40,maxPrice:p.maxPrice,localPreference:p.preference,homeNode:p.home,workNode:p.work,wage:p.wage,
    memory:{lastChoice:null,lastReason:'Aucune décision.',lastPrice:0,refusedPrice:0,purchases:0,lastPurchaseTick:0,lastVisitTick:0,lastWorkDay:0},
    blackboard:{goal:null,status:BT_STATUS.Success,route:[],routeIndex:0,targetNode:p.start,decisionTick:0,cooldownUntilTick:0,activePath:'Repos',scores:{playerShop:0,competitor:0,work:0,home:0,taxi:0}}
  }));
  return {version:1,ticks:0,accumulator:0,startDay:day,startTime:time,agents,supplier:{stock:72,wallet:5000,trust:40,quote:null,lastDay:day,lastDecision:{kind:'ready',offeredPrice:0,quantity:0,unitPrice:350,reason:'Ama attend une commande au marché.',tick:0}},competitor:{stock:48,wallet:0,price:600},upstream:{stock:192,wallet:0},employer:{wallet:24000},ledger:{consumed:0,wages:0,supplierProcurement:0},trades:[],tradeCounter:0};
}
const clock=society=>({day:society.startDay+Math.floor((society.startTime+society.ticks*STEP/30)/24),time:(society.startTime+society.ticks*STEP/30)%24});
function nearestNode(agent){let nearest=0,distance=Infinity;for(let i=0;i<nodes.length;i++){const d=(agent.x-nodes[i][0])**2+(agent.z-nodes[i][1])**2;if(d<distance){distance=d;nearest=i;}}return nearest;}
function liesOnSidewalk(x,z){
  for(const [from,to] of links){const a=nodes[from],b=nodes[to],dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz));if(Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)<=.02)return true;}
  return false;
}
function destination(agent,goal){return goal==='playerShop'?14:goal==='competitor'?12:goal==='work'?agent.workNode:goal==='home'?agent.homeNode:9;}
function remember(agent,choice,reason,price){agent.memory.lastChoice=choice;agent.memory.lastReason=reason;agent.memory.lastPrice=price;}
function chooseDestination(agent,goal,reason,price,society){
  const b=agent.blackboard,target=destination(agent,goal);
  remember(agent,goal,reason,price);
  if(b.goal===goal&&b.targetNode===target&&b.status===BT_STATUS.Running)return;
  b.goal=goal;b.targetNode=target;b.route=[...paths[nearestNode(agent)][target]];b.routeIndex=0;b.status=BT_STATUS.Running;
  b.decisionTick=society.ticks;agent.state='walk';
}
function scoreOptions(agent,state,now){
  const society=state.society,b=agent.blackboard,scores=b.scores,hunger=clamp(1-agent.food/100),fatigue=clamp(1-agent.energy/100),daytime=now.time>=7&&now.time<19;
  const localAvailable=state.biz&&state.stock>0&&now.time>=7&&now.time<21;
  const affordable=customerCanAfford(agent,state.price);
  if(localAvailable&&!affordable){agent.memory.refusedPrice=state.price;agent.memory.lastReason='Le prix du comptoir dépasse mon budget.';}
  const cooldown=society.ticks<agent.blackboard.cooldownUntilTick;
  scores.playerShop=localAvailable&&affordable&&!cooldown?hunger*hunger*(.3+.38*clamp(1-state.price/agent.maxPrice)+.28*agent.localPreference+.18*agent.relationship/100):0;
  scores.competitor=society.competitor.stock>0&&customerCanAfford(agent,society.competitor.price)&&!cooldown?hunger*hunger*(.35+.25*clamp(1-society.competitor.price/agent.maxPrice)+.18*(1-agent.localPreference)):0;
  scores.work=daytime?(.13+.2*clamp(1-agent.wallet/4000))*clamp(agent.energy/75):0;
  scores.home=now.time<7||now.time>=19?.95:clamp(fatigue*fatigue*.65+(agent.inventory>0?.75:0));
  scores.taxi=now.time>=16&&now.time<19?(agent.job==='chauffeur'?.32:.1):.025;
  for(const goal of goals)scores[goal]=clamp(scores[goal]);
  return scores;
}
function bestGoal(agent,state,now,foodOnly=false){
  const scores=scoreOptions(agent,state,now),options=foodOnly?goals.slice(0,2):goals;let best=null,highest=-1;
  for(const goal of options){const value=scores[goal]+(goal===agent.blackboard.goal&&scores[goal]>0?.025:0);if(value>highest){best=goal;highest=value;}}
  return highest>0?best:null;
}
// Real shared composites, composed once. Actions retain progress in the agent's
// serialized blackboard; conditional aborts do not restart a Running route.
const condition=(id,test)=>Object.freeze({type:'condition',id,test});
const action=(id,run)=>Object.freeze({type:'action',id,run});
const sequence=(id,...children)=>Object.freeze({type:'sequence',id,children:Object.freeze(children)});
const selector=(id,...children)=>Object.freeze({type:'selector',id,children:Object.freeze(children)});
function treeTick(node,context){
  if(node.type==='condition')return node.test(context)?BT_STATUS.Success:BT_STATUS.Failure;
  if(node.type==='action'){context.agent.blackboard.activePath=node.id;return node.run(context);}
  if(node.type==='sequence'){for(const child of node.children){const status=treeTick(child,context);if(status!==BT_STATUS.Success)return status;}return BT_STATUS.Success;}
  for(const child of node.children){const status=treeTick(child,context);if(status!==BT_STATUS.Failure)return status;}return BT_STATUS.Failure;
}
const continueGoal=({agent,state,now},goal,reason)=>{chooseDestination(agent,goal,reason,state.price,state.society);return executeIntent(agent,state,now);};
const CLIENT_TREE=selector('Priorités',
  sequence('Fatigue urgente',condition('Fatigue',({agent})=>agent.energy<18),action('Urgence → logement',c=>continueGoal(c,'home','Je dois récupérer de l’énergie.'))),
  sequence('Courses à rapporter',condition('Sac plein',({agent})=>agent.inventory>0),action('Transport → logement',c=>continueGoal(c,'home','Je rapporte les courses à mon foyer.'))),
  sequence('Faim urgente',condition('Faim',({agent})=>agent.food<20),action('Faim → choix du commerce',c=>{const goal=bestGoal(c.agent,c.state,c.now,true);return goal?continueGoal(c,goal,'Je cherche un repas à un prix accessible.'):BT_STATUS.Failure;})),
  action('Utilité → déplacement → activité',c=>{
    const a=c.agent,b=a.blackboard,s=c.state.society;
    const unavailable=b.goal==='playerShop'&&(!c.state.biz||!c.state.stock||c.state.price>a.maxPrice||c.state.price>a.wallet||c.now.time<7||c.now.time>=21)||b.goal==='competitor'&&(!s.competitor.stock||s.competitor.price>a.maxPrice||s.competitor.price>a.wallet);
    if(!b.goal||unavailable||s.ticks-b.decisionTick>=8){
      const goal=bestGoal(a,c.state,c.now)||'home';
      const refused=c.state.biz&&c.state.stock>0&&!customerCanAfford(a,c.state.price);
      const reason=goal==='playerShop'?'Le prix et les conditions du comptoir me conviennent.':goal==='competitor'?(refused?'Le comptoir dépasse mon budget ; je choisis le concurrent.':'Je préfère une offre concurrente accessible.'):goal==='work'?(refused?'Le comptoir dépasse mon budget ; je vais travailler.':'Je vais travailler pour préserver mon budget.'):goal==='taxi'?'Je rejoins l’arrêt de taxi.':'Je rentre me reposer.';
      chooseDestination(a,goal,reason,c.state.price,s);b.decisionTick=s.ticks;
    }
    return executeIntent(a,c.state,c.now);
  })
);
function recordTrade(society,trade){society.tradeCounter++;society.trades.push({id:'trade-'+society.tradeCounter,tick:society.ticks,...trade});if(society.trades.length>16)society.trades.shift();}
function settleClient(agent,state,venue){
  const society=state.society,shop=venue==='kiosk'?state:society.competitor,target=nodes[venue==='kiosk'?14:12],price=shop.price;
  // This guard is the transaction boundary. All preconditions precede mutation.
  if(!customerCanAfford(agent,price)||Math.hypot(agent.x-target[0],agent.z-target[1])>.55||agent.inventory>=CAPACITY||!Number.isInteger(shop.stock)||shop.stock<1||venue==='kiosk'&&!state.biz)return false;
  const before={playerMoneyBefore:state.money,actorWalletBefore:agent.wallet,stockBefore:shop.stock};
  const costBasis=venue==='kiosk'&&Number.isFinite(state.stockCost)?state.stockCost/state.stock:0;
  agent.wallet-=price;agent.inventory++;agent.memory.purchases++;agent.memory.lastPurchaseTick=society.ticks;shop.stock--;
  if(venue==='kiosk'){
    state.money+=price;state.sales++;state.revenue+=price;state.experience++;
    if(Number.isFinite(state.stockCost))state.stockCost=Math.max(0,state.stockCost-costBasis);
    if(Number.isFinite(state.goodsCostSold))state.goodsCostSold+=costBasis;
    agent.relationship=clamp(agent.relationship+4,0,100);if(state.sales%5===0)state.rep=clamp(state.rep+1,0,100);
  }else shop.wallet+=price;
  agent.blackboard.cooldownUntilTick=society.ticks+80;
  recordTrade(society,{actorId:agent.id,buyerId:agent.id,venue,quantity:1,unitPrice:price,total:price,actorX:agent.x,actorZ:agent.z,...before,playerMoneyAfter:state.money,actorWalletAfter:agent.wallet,stockAfter:shop.stock,costBasis});
  return true;
}
function moveAlongRoute(agent){
  const b=agent.blackboard;let remaining=agent.speed*STEP,moved=false;
  while(b.routeIndex<b.route.length&&remaining>0){
    const target=nodes[b.route[b.routeIndex]],dx=target[0]-agent.x,dz=target[1]-agent.z,d=Math.hypot(dx,dz);
    if(d<1e-8){b.routeIndex++;continue;}
    const distance=Math.min(d,remaining);agent.x+=dx/d*distance;agent.z+=dz/d*distance;agent.heading=Math.atan2(dx,dz);remaining-=distance;moved=true;
    if(distance===d){agent.x=target[0];agent.z=target[1];b.routeIndex++;}
  }
  if(moved)agent.state='walk';return b.routeIndex>=b.route.length;
}
function executeIntent(agent,state,now){
  const b=agent.blackboard,society=state.society;
  const arriving=agent.state==='walk';
  if(!moveAlongRoute(agent)){b.status=BT_STATUS.Running;return b.status;}
  if(arriving){agent.visits++;agent.memory.lastVisitTick=society.ticks;}
  if(b.goal==='playerShop'||b.goal==='competitor'){
    agent.state='buy';const success=settleClient(agent,state,b.goal==='playerShop'?'kiosk':'competitor');
    b.status=success?BT_STATUS.Success:BT_STATUS.Failure;
    if(!success){agent.memory.lastReason='L’achat a échoué : offre ou budget indisponible.';b.goal=null;}
    return b.status;
  }
  if(b.goal==='home'){
    agent.state='home';if(agent.inventory){agent.householdFood+=agent.inventory;agent.inventory=0;}
    if(agent.food<75&&agent.householdFood>0){agent.householdFood--;agent.food=clamp(agent.food+45,0,100);society.ledger.consumed++;}
    agent.energy=clamp(agent.energy+STEP*.2,0,100);
  }else if(b.goal==='work'){
    agent.state='work';
    if(agent.memory.lastWorkDay<now.day&&society.employer.wallet>=agent.wage){society.employer.wallet-=agent.wage;agent.wallet+=agent.wage;society.ledger.wages+=agent.wage;agent.memory.lastWorkDay=now.day;}
  }else agent.state='waitTaxi';
  b.status=BT_STATUS.Running;return b.status;
}
function societyStep(state){
  const society=state.society;society.ticks++;const now=clock(society),supplier=society.supplier;
  if(supplier.quote&&society.ticks>=supplier.quote.expiresAt)supplier.quote=null;
  if(now.day>supplier.lastDay){
    supplier.lastDay=now.day;
    // Finite upstream goods and cash payment, never magical replenishment.
    if(supplier.stock<24){const quantity=Math.min(12,society.upstream.stock,Math.floor(supplier.wallet/280));supplier.stock+=quantity;society.upstream.stock-=quantity;supplier.wallet-=quantity*280;society.upstream.wallet+=quantity*280;society.ledger.supplierProcurement+=quantity*280;}
  }
  for(let i=1;i<society.agents.length;i++){
    const agent=society.agents[i];agent.food=clamp(agent.food-STEP*.018,0,100);agent.energy=clamp(agent.energy-STEP*(agent.state==='work'?.018:.008),0,100);
    treeTick(CLIENT_TREE,{agent,state,now});
  }
}
export function tickSociety(state,dt){
  if(!state?.society||!Number.isFinite(dt)||dt<=0||dt>1200)return [];
  const society=state.society,oldCounter=society.tradeCounter;
  // Normalize the serialized remainder to nanoseconds so decimal render
  // partitions (.1 + .2 versus .3) do not accumulate different float residues.
  society.accumulator=Math.round((society.accumulator+dt)*1e9)/1e9;
  while(society.accumulator+1e-10>=STEP){society.accumulator-=STEP;societyStep(state);}
  society.accumulator=Math.round(Math.max(0,society.accumulator)*1e9)/1e9;
  return society.trades.filter(t=>t.venue==='kiosk'&&Number(t.id.slice(6))>oldCounter).map(t=>({type:'sale',actorId:t.actorId,message:`${society.agents.find(a=>a.id===t.actorId).name} a acheté un produit : ${t.total} F.`,trade:t}));
}
function supplierDecision(society,kind,offeredPrice,quantity,unitPrice,reason){society.supplier.lastDecision={kind,offeredPrice,quantity,unitPrice,reason,tick:society.ticks};}
export function negotiateSupplier(state,{price,quantity=4}={}){
  const society=state?.society;if(!society)return {ok:false,message:'Fournisseur indisponible.'};const supplier=society.supplier;
  if(!Number.isInteger(price)||price<1||price>350||!Number.isInteger(quantity)||quantity<1||quantity>CAPACITY)return {ok:false,message:'Proposez un prix de 1 à 350 F et 1 à 12 produits.'};
  if(quantity>supplier.stock)return {ok:false,message:'Ama ne dispose pas de cette quantité.'};
  if(price<=150){supplier.trust=Math.max(0,supplier.trust-3);society.agents[0].relationship=supplier.trust;supplier.quote=null;supplierDecision(society,'rejected',price,quantity,350,'Cette offre ne couvre pas mes coûts.');return {ok:false,accepted:false,unitPrice:350,message:'Ama refuse cette offre. La confiance diminue.'};}
  const floor=Math.min(350,(quantity>=8?300:quantity>=4?315:335)+(supplier.trust<20?20:0));
  const accepted=price>=floor,unitPrice=accepted?price:floor;
  supplier.quote={quantity,unitPrice,expiresAt:society.ticks+240};
  supplierDecision(society,accepted?'accepted':'counter',price,quantity,unitPrice,accepted?'Cette commande et ce prix me conviennent.':'Je peux vous proposer ce prix pour cette commande.');
  return {ok:true,accepted,counter:!accepted,unitPrice,message:accepted?`Ama accepte : ${quantity} produits à ${unitPrice} F.`:`Ama propose ${unitPrice} F par produit pour cette commande.`};
}
export function buySupplier(state,quantity=4){
  const society=state?.society;if(!society)return {ok:false,message:'Fournisseur indisponible.'};const supplier=society.supplier;
  const fail=message=>({ok:false,message});
  if(!Number.isInteger(quantity)||quantity<1||quantity>CAPACITY||state.carried+quantity>CAPACITY)return fail('Le sac contient au maximum 12 marchandises.');
  const quote=supplier.quote&&society.ticks<supplier.quote.expiresAt?supplier.quote:null;
  if(quote&&quantity>quote.quantity)return fail('Cette quantité dépasse la commande négociée.');
  const unitPrice=quote?quote.unitPrice:350,total=quantity*unitPrice;
  if(supplier.stock<quantity)return fail('Le stock d’Ama est insuffisant.');
  if(!Number.isFinite(state.money)||state.money<total)return fail('Fonds insuffisants.');
  const before={playerMoneyBefore:state.money,actorWalletBefore:supplier.wallet,stockBefore:supplier.stock};
  state.money-=total;state.costs+=total;state.carried+=quantity;supplier.wallet+=total;supplier.stock-=quantity;supplier.trust=clamp(supplier.trust+2,0,100);society.agents[0].relationship=supplier.trust;supplier.quote=null;
  recordTrade(society,{actorId:'resident-0',buyerId:'player',venue:'market',quantity,unitPrice,total,actorX:-10,actorZ:1,...before,playerMoneyAfter:state.money,actorWalletAfter:supplier.wallet,stockAfter:supplier.stock,costBasis:total});
  supplierDecision(society,'sold',unitPrice,quantity,unitPrice,'Commande remise au joueur.');
  return {ok:true,unitPrice,cost:total,quantity,message:`${quantity} produits achetés à ${unitPrice} F : transportez-les au comptoir.`};
}

/** Strict bounded restoration. Returns a clean copy or null; never mutates raw. */
export function validateSociety(raw){
  const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
  const integer=(n,min,max)=>Number.isInteger(n)&&finite(n,min,max);
  const string=(s,max)=>typeof s==='string'&&s.length<=max;
  try{
    if(!raw||raw.version!==1||!integer(raw.ticks,0,1e8)||!finite(raw.accumulator,0,STEP)||raw.accumulator>=STEP||!integer(raw.startDay,1,1e6)||!finite(raw.startTime,0,24)||raw.startTime>=24||!Array.isArray(raw.agents)||raw.agents.length!==8)return null;
    const result=createSociety({day:raw.startDay,time:raw.startTime});result.ticks=raw.ticks;result.accumulator=raw.accumulator;
    for(let i=0;i<8;i++){
      const input=raw.agents[i],a=result.agents[i];if(!input||input.id!==a.id||input.name!==a.name||input.job!==a.job||input.role!==a.role||!states.includes(input.state))return null;
      for(const key of ['x','z','heading','food','energy','relationship','wallet','inventory','householdFood','visits']){
        const bounds=key==='x'?[-45,45]:key==='z'?[-42,42]:key==='heading'?[-Math.PI,Math.PI]:['food','energy','relationship'].includes(key)?[0,100]:key==='wallet'?[0,1e8]:key==='visits'?[0,1e8]:key==='inventory'?[0,CAPACITY]:[0,10000];
        if(!finite(input[key],...bounds)||['wallet','inventory','householdFood','visits'].includes(key)&&!Number.isInteger(input[key]))return null;a[key]=input[key];
      }
      a.state=input.state;
      if(!liesOnSidewalk(a.x,a.z)||i===0&&(a.x!==-10||a.z!==1||a.state!=='sell'))return null;
      if(input.speed!==a.speed||input.maxPrice!==a.maxPrice||input.localPreference!==a.localPreference||input.homeNode!==a.homeNode||input.workNode!==a.workNode||input.wage!==a.wage)return null;
      const memory=input.memory,b=input.blackboard;if(!memory||!b||memory.lastChoice!==null&&!goals.includes(memory.lastChoice)||!string(memory.lastReason,200)||!integer(memory.lastPrice,0,1200)||!integer(memory.refusedPrice,0,1200))return null;
      for(const key of ['purchases','lastPurchaseTick','lastVisitTick','lastWorkDay'])if(!integer(memory[key],0,1e8))return null;
      if(b.goal!==null&&!goals.includes(b.goal)||!Object.values(BT_STATUS).includes(b.status)||!Array.isArray(b.route)||b.route.length>24||!integer(b.routeIndex,0,b.route.length)||!integer(b.targetNode,0,nodes.length-1)||!integer(b.decisionTick,0,raw.ticks)||!integer(b.cooldownUntilTick,0,1e8)||!string(b.activePath,100)||!b.scores)return null;
      if(i===0&&(b.goal!==null||b.route.length||b.routeIndex!==0||b.targetNode!==3))return null;
      for(let j=0;j<b.route.length;j++){if(!integer(b.route[j],0,nodes.length-1)||j&&!adjacency[b.route[j-1]].includes(b.route[j]))return null;}
      for(const goal of goals)if(!finite(b.scores[goal],0,1))return null;
      a.memory={lastChoice:memory.lastChoice,lastReason:memory.lastReason,lastPrice:memory.lastPrice,refusedPrice:memory.refusedPrice,purchases:memory.purchases,lastPurchaseTick:memory.lastPurchaseTick,lastVisitTick:memory.lastVisitTick,lastWorkDay:memory.lastWorkDay};
      a.blackboard={goal:b.goal,status:b.status,route:[...b.route],routeIndex:b.routeIndex,targetNode:b.targetNode,decisionTick:b.decisionTick,cooldownUntilTick:b.cooldownUntilTick,activePath:b.activePath,scores:Object.fromEntries(goals.map(goal=>[goal,b.scores[goal]]))};
    }
    for(const key of ['supplier','competitor','upstream']){const input=raw[key];if(!input||!integer(input.stock,0,10000)||!integer(input.wallet,0,1e8))return null;result[key].stock=input.stock;result[key].wallet=input.wallet;}
    const supplier=raw.supplier,decision=supplier.lastDecision;
    if(!integer(supplier.trust,0,100)||!integer(supplier.lastDay,1,1e8)||result.agents[0].relationship!==supplier.trust||!decision||!['ready','accepted','counter','rejected','sold'].includes(decision.kind)||!integer(decision.offeredPrice,0,350)||!integer(decision.quantity,0,12)||!integer(decision.unitPrice,1,350)||!string(decision.reason,200)||!integer(decision.tick,0,raw.ticks))return null;
    result.supplier.trust=supplier.trust;result.supplier.lastDay=supplier.lastDay;result.supplier.lastDecision={kind:decision.kind,offeredPrice:decision.offeredPrice,quantity:decision.quantity,unitPrice:decision.unitPrice,reason:decision.reason,tick:decision.tick};
    if(supplier.quote!==null){const q=supplier.quote;if(!q||!integer(q.quantity,1,12)||!integer(q.unitPrice,300,350)||!integer(q.expiresAt,raw.ticks+1,raw.ticks+240))return null;result.supplier.quote={quantity:q.quantity,unitPrice:q.unitPrice,expiresAt:q.expiresAt};}
    if(raw.competitor.price!==600||!raw.employer||!integer(raw.employer.wallet,0,1e8)||!raw.ledger)return null;result.employer.wallet=raw.employer.wallet;
    for(const key of ['consumed','wages','supplierProcurement']){if(!integer(raw.ledger[key],0,1e8))return null;result.ledger[key]=raw.ledger[key];}
    if(!integer(raw.tradeCounter,0,1e8)||!Array.isArray(raw.trades)||raw.trades.length!==Math.min(raw.tradeCounter,16))return null;result.tradeCounter=raw.tradeCounter;
    let lastId=Math.max(0,raw.tradeCounter-raw.trades.length);
    for(const trade of raw.trades){
      const number=Number(trade?.id?.slice(6));if(!trade||trade.id!=='trade-'+number||number!==lastId+1||!integer(number,1,raw.tradeCounter)||!result.agents.some(a=>a.id===trade.actorId)||!['kiosk','market','competitor'].includes(trade.venue)||trade.buyerId!==(trade.venue==='market'?'player':trade.actorId)||!integer(trade.quantity,1,12)||!integer(trade.unitPrice,1,1200)||trade.total!==trade.quantity*trade.unitPrice||!integer(trade.tick,0,raw.ticks)||!finite(trade.actorX,-45,45)||!finite(trade.actorZ,-42,42)||!finite(trade.costBasis,0,1e8))return null;
      for(const key of ['playerMoneyBefore','playerMoneyAfter','actorWalletBefore','actorWalletAfter','stockBefore','stockAfter'])if(!integer(trade[key],0,1e9))return null;
      if(trade.stockBefore-trade.stockAfter!==trade.quantity)return null;
      if(trade.venue==='market'?(trade.playerMoneyBefore-trade.playerMoneyAfter!==trade.total||trade.actorWalletAfter-trade.actorWalletBefore!==trade.total):(trade.actorWalletBefore-trade.actorWalletAfter!==trade.total||trade.playerMoneyAfter-trade.playerMoneyBefore!==(trade.venue==='kiosk'?trade.total:0)))return null;
      const target=nodes[trade.venue==='market'?3:trade.venue==='kiosk'?14:12];if(Math.hypot(trade.actorX-target[0],trade.actorZ-target[1])>.55)return null;
      result.trades.push({id:trade.id,actorId:trade.actorId,buyerId:trade.buyerId,venue:trade.venue,quantity:trade.quantity,unitPrice:trade.unitPrice,total:trade.total,tick:trade.tick,actorX:trade.actorX,actorZ:trade.actorZ,playerMoneyBefore:trade.playerMoneyBefore,playerMoneyAfter:trade.playerMoneyAfter,actorWalletBefore:trade.actorWalletBefore,actorWalletAfter:trade.actorWalletAfter,stockBefore:trade.stockBefore,stockAfter:trade.stockAfter,costBasis:trade.costBasis});lastId=number;
    }
    return clone(result);
  }catch{return null;}
}
