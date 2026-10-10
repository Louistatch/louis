/** Deterministic local economy. Currency is virtual CFA francs; no real payments. */
export const ECONOMY = Object.freeze({wholesale:350, capacity:12, kioskCost:9000, rent:800, meal:300, secondsPerDay:720});
/** Progression: experience comes from sales (+1) and deliveries (+4). Each perk is enforced here, not in the UI. */
export const LEVELS=Object.freeze([{xp:0,title:'Nouveau venu',perk:'Sac de 12 produits'},{xp:12,title:'Débrouillard',perk:'Sac de 16 produits'},{xp:35,title:'Commerçant du quartier',perk:'Livraisons payées +25 %'},{xp:70,title:'Figure d’Akoé',perk:'Deux livraisons par jour'}]);
export function levelFor(experience){let level=1;LEVELS.forEach((l,i)=>{if(experience>=l.xp)level=i+1;});return level;}
export const capacityFor=s=>levelFor(s.experience)>=2?16:ECONOMY.capacity;
export const contractsPerDay=s=>levelFor(s.experience)>=4?2:1;
/** Delivery destinations are real places of the authored district; farther means better paid. */
export const DESTINATIONS=Object.freeze({studio:{name:'Atelier de couture',reward:1200},pharmacy:{name:'Pharmacie du quartier',reward:1500},cafe:{name:'Café Le Palmier',reward:1800}});
const hash=n=>{n=Math.imul(n^61^(n>>>16),9);n^=n>>>4;n=Math.imul(n,0x27d4eb2d);return (n^(n>>>15))>>>0;};
/** Day 1 stays the guided tutorial: studio delivery and an ordinary day. */
export function destinationFor(day,index=0){if(day<=1&&index===0)return 'studio';const ids=Object.keys(DESTINATIONS);return ids[(hash(day*31+index)+index)%ids.length];}
export function contractReward(s,destination){return Math.round(DESTINATIONS[destination].reward*(levelFor(s.experience)>=3?1.25:1));}
/** Deterministic daily events change customer traffic, never prices or saved money. */
export const DAY_EVENTS=Object.freeze([{id:'calm',title:'Journée ordinaire',text:'Fréquentation habituelle au comptoir.',traffic:1},{id:'market',title:'Grand jour de marché',text:'Le quartier est animé : clients 30 % plus fréquents.',traffic:1.3},{id:'rain',title:'Averse sur Lomé',text:'Moins de passants : clients 30 % moins fréquents.',traffic:.7},{id:'festival',title:'Fête de quartier',text:'Musique et visiteurs : clients 50 % plus fréquents.',traffic:1.5}]);
export function dayEvent(day){return day<=1?DAY_EVENTS[0]:DAY_EVENTS[hash(day)%DAY_EVENTS.length];}
export function demandFor(price){return price<=450?1:price<=650?.68:price<=850?.3:0;}
export function createState() { return {version:3,name:'Kossi',city:'lome',money:15000,day:1,time:8,energy:90,food:90,rep:0,experience:0,carried:0,stock:0,biz:false,price:550,sales:0,revenue:0,costs:0,debt:0,rentPaid:1,home:false,contract:null,completed:0,conversations:[],saleClock:0,appearance:{shirt:'#e8dfc6',skin:'#633f2e'},position:{x:-7,z:12},lastContractDay:0,dailyContracts:0,events:[]}; }
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const locations={buy:'market',invest:'kiosk',deposit:'kiosk',price:'kiosk',contract:'market',meal:'market',rest:'home',rent:'home',housing:'home'};
export class Simulation {
  constructor(state){this.state=createState();if(state)this.load(state);}
  snapshot(){return JSON.parse(JSON.stringify(this.state));}
  event(message){this.state.events.push(message);this.state.events=this.state.events.slice(-8);}
  tick(dt){
    if(!Number.isFinite(dt)||dt<0)return;dt=Math.min(dt,60);const s=this.state;
    s.time+=dt*24/ECONOMY.secondsPerDay;s.food=clamp(s.food-dt*.018,0,100);s.energy=clamp(s.energy-dt*.01,0,100);
    while(s.time>=24){s.time-=24;s.day++;if(s.rentPaid<s.day){s.debt+=ECONOMY.rent;this.event('Loyer quotidien : 800 F à régler au logement.');}if(s.contract&&s.day>s.contract.deadline){s.contract=null;s.rep=clamp(s.rep-2,0,100);this.event('Le contrat de livraison a expiré.');}const ev=dayEvent(s.day);if(ev.id!=='calm')this.event('Jour '+s.day+' · '+ev.title+' : '+ev.text);}
    if(!s.biz||s.time<7||s.time>21||!s.stock)return;
    s.saleClock+=dt;
    const interval=12/dayEvent(s.day).traffic;
    while(s.saleClock>=interval){s.saleClock-=interval;const demand=demandFor(s.price);const visit=(s.sales+s.day+Math.floor(s.time*60))%10;
      if(visit<demand*10&&s.stock){s.stock--;s.sales++;s.money+=s.price;s.revenue+=s.price;this.gain(1);if(s.sales%5===0){s.rep=clamp(s.rep+1,0,100);this.event('Cinq clients servis : votre réputation progresse.');}}
    }
  }
  gain(xp){const before=levelFor(this.state.experience);this.state.experience+=xp;const after=levelFor(this.state.experience);if(after>before)this.event('Niveau '+after+' · '+LEVELS[after-1].title+' : '+LEVELS[after-1].perk+'.');}
  act(action,context={}){
    const a=typeof action==='string'?{type:action}:action;const s=this.state;
    const fail=message=>({ok:false,message});const pay=n=>{if(s.money<n)return false;s.money-=n;s.costs+=n;return true;};
    if(!a||typeof a.type!=='string')return fail('Action invalide.');
    if(locations[a.type]&&context.location!==locations[a.type])return fail('Approchez-vous du lieu correspondant.');
    if(a.type==='deliver'&&s.contract&&context.location!==s.contract.destination)return fail('Ce colis est attendu à : '+DESTINATIONS[s.contract.destination].name+'.');
    const capacity=capacityFor(s);let message;
    const quantity=a.quantity??4;
    switch(a.type){
      case 'buy': if(!Number.isInteger(quantity)||quantity<1||quantity>capacity||s.carried+quantity>capacity)return fail('Le sac contient au maximum '+capacity+' marchandises.');if(!pay(quantity*ECONOMY.wholesale))return fail('Fonds insuffisants.');s.carried+=quantity;break;
      case 'invest':if(s.biz)return fail('Votre kiosque est déjà ouvert.');if(!pay(ECONOMY.kioskCost))return fail('Il faut 9 000 F pour le kiosque.');s.biz=true;break;
      case 'deposit':if(!s.biz||!s.carried)return fail('Ouvrez le kiosque et transportez des marchandises.');s.stock+=s.carried;s.carried=0;break;
      case 'price':if(!s.biz||!Number.isInteger(a.price)||a.price<350||a.price>1200)return fail('Prix autorisé : 350 à 1 200 F.');s.price=a.price;break;
      case 'contract':{if(s.contract)return fail('Une livraison est déjà en cours.');const taken=s.lastContractDay===s.day?Math.max(1,s.dailyContracts):0;if(taken>=contractsPerDay(s))return fail(contractsPerDay(s)===1?'Une livraison par jour : revenez demain.':'Livraisons du jour terminées : revenez demain.');const destination=destinationFor(s.day,taken);s.lastContractDay=s.day;s.dailyContracts=taken+1;s.contract={origin:context.location,destination,deadline:s.day+1,reward:contractReward(s,destination)};message='Colis confié : livrez-le à « '+DESTINATIONS[destination].name+' » avant demain soir.';break;}
      case 'deliver':if(!s.contract)return fail('Aucun colis à livrer.');message='Livraison terminée : '+s.contract.reward.toLocaleString('fr-FR').replace(/\s/g,' ')+' F gagnés.';s.money+=s.contract.reward;s.completed++;s.rep=clamp(s.rep+2,0,100);s.contract=null;this.gain(4);break;
      case 'meal':if(s.food>90)return fail('Vous êtes rassasié.');if(!pay(ECONOMY.meal))return fail('Fonds insuffisants.');s.food=clamp(s.food+35,0,100);break;
      case 'rent':if(s.debt===0)return fail('Votre loyer est à jour.');if(!pay(s.debt))return fail('Fonds insuffisants.');s.debt=0;s.rentPaid=s.day;break;
      case 'housing':if(s.home)return fail('Le logement est déjà aménagé.');if(!pay(4000))return fail('Aménagement : 4 000 F.');s.home=true;break;
      case 'rest':if(s.debt)return fail('Réglez le loyer avant de vous reposer.');s.energy=clamp(s.energy+(s.home?45:25),0,100);this.tick(60);break;
      case 'talk':if(typeof context.npcId!=='string'||!context.npcId||context.npcId.length>64)return fail('Habitant inconnu.');if(s.conversations.includes(context.npcId))return fail('Nous avons déjà discuté. Revenez découvrir mon quartier.');s.conversations.push(context.npcId);s.conversations=s.conversations.slice(-100);break;
      default:return fail('Action inconnue.');
    }
    message??={buy:'Marchandises achetées : transportez-les au kiosque.',invest:'Votre kiosque est ouvert.',deposit:'Stock livré : les clients achètent pendant votre exploration.',price:'Prix mis à jour : un prix élevé réduit la demande.',meal:'Repas servi.',rest:'Vous êtes reposé.',rent:'Loyer réglé.',housing:'Votre logement est aménagé.',talk:'Bienvenue ! Au marché, achetez à 350 F et transportez le stock au kiosque.'}[a.type];this.event(message);return {ok:true,message};
  }
  load(raw){
    try{const input=typeof raw==='string'?JSON.parse(raw):raw;if(!input||typeof input!=='object'||Array.isArray(input))return false;
      const s=createState();if(input.version!==2&&input.version!==3){if(input.version!==undefined)return false;if(!Number.isFinite(input.money)||input.money<0||input.money>1e8)return false;s.money=input.money;if(typeof input.name==='string')s.name=input.name.slice(0,24);this.state=s;return true;}
      for(const key of ['money','day','time','energy','food','rep','experience','carried','stock','price','sales','revenue','costs','debt','rentPaid','completed','saleClock']){if(!Number.isFinite(input[key])||input[key]<0||input[key]>1e9)return false;s[key]=input[key];}
      for(const key of ['day','carried','stock','price','sales','rentPaid','completed'])if(!Number.isInteger(s[key]))return false;
      if(s.day<1||s.time>=24||s.energy>100||s.food>100||s.rep>100||s.carried>capacityFor(s)||s.price<350||s.price>1200)return false;
      if(typeof input.biz!=='boolean'||typeof input.home!=='boolean'||typeof input.name!=='string'||!['lome','kara','kpalime'].includes(input.city))return false;
      if(input.appearance!==undefined){if(!input.appearance||!['#e8dfc6','#217d7b','#b9563e'].includes(input.appearance.shirt)||!['#633f2e','#936044','#b98259'].includes(input.appearance.skin))return false;s.appearance={...input.appearance};}
      if(input.position!==undefined){if(!input.position||!Number.isFinite(input.position.x)||!Number.isFinite(input.position.z)||Math.abs(input.position.x)>45||Math.abs(input.position.z)>42)return false;s.position={x:input.position.x,z:input.position.z};}
      if(input.lastContractDay!==undefined){if(!Number.isInteger(input.lastContractDay)||input.lastContractDay<0||input.lastContractDay>s.day)return false;s.lastContractDay=input.lastContractDay;}
      // v2 saves had one studio delivery per day and no counter: migrate conservatively.
      if(input.version===2)s.dailyContracts=s.lastContractDay===s.day?1:0;
      else{if(!Number.isInteger(input.dailyContracts)||input.dailyContracts<0||input.dailyContracts>2)return false;s.dailyContracts=input.dailyContracts;}
      s.biz=input.biz;s.home=input.home;s.name=input.name.slice(0,24);s.city=input.city;
      if(!Array.isArray(input.conversations)||input.conversations.length>100||input.conversations.some(x=>typeof x!=='string'||x.length>64))return false;s.conversations=[...input.conversations];
      if(input.events!==undefined){if(!Array.isArray(input.events)||input.events.length>8)return false;const events=[...input.events];if(events.some(x=>typeof x!=='string'||x.length>240))return false;s.events=events;}
      if(input.contract!==null){const c=input.contract,base=c&&Object.hasOwn(DESTINATIONS,c.destination)?DESTINATIONS[c.destination].reward:NaN;if(!c||c.origin!=='market'||(input.version===2&&c.destination!=='studio')||(c.reward!==base&&c.reward!==Math.round(base*1.25))||!Number.isInteger(c.deadline)||c.deadline<s.day||c.deadline>s.day+1)return false;s.contract={...c};}
      this.state=s;return true;
    }catch{return false;}
  }
}
