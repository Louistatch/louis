import {createSociety,validateSociety,tickSociety,negotiateSupplier,buySupplier} from './society.js';

/** Authoritative local economy; all currency is virtual, never a real payment. */
export const ECONOMY = Object.freeze({wholesale:350,capacity:12,kioskCost:9000,rent:800,meal:300,secondsPerDay:720,step:.25});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const locations={buy:'market',negotiate:'market',invest:'kiosk',deposit:'kiosk',price:'kiosk',contract:'market',deliver:'studio',meal:'market',rest:'home',rent:'home',housing:'home'};
const numericKeys=['money','day','time','energy','food','rep','experience','carried','stock','price','sales','revenue','costs','debt','rentPaid','completed','saleClock'];

export function createState() {
  return {version:3,name:'Kossi',city:'lome',money:15000,day:1,time:8,energy:90,food:90,rep:0,experience:0,
    carried:0,stock:0,biz:false,price:550,sales:0,revenue:0,costs:0,debt:0,rentPaid:1,home:false,contract:null,
    completed:0,conversations:[],saleClock:0,appearance:{shirt:'#e8dfc6',skin:'#633f2e'},position:{x:-7,z:12},
    lastContractDay:0,events:[],stepRemainder:0,carriedCost:0,stockCost:0,goodsCostSold:0,society:createSociety()};
}

export class Simulation {
  constructor(state) {this.state=createState();if(state)this.load(state);}
  snapshot() {return JSON.parse(JSON.stringify(this.state));}
  event(message) {this.state.events.push(message);this.state.events=this.state.events.slice(-8);}

  tick(dt) {
    if(!Number.isFinite(dt)||dt<0||dt>3600)return;
    const s=this.state,total=s.stepRemainder+dt,steps=Math.floor((total+1e-10)/ECONOMY.step);
    s.stepRemainder=Math.max(0,Math.round((total-steps*ECONOMY.step)*1e9)/1e9);
    for(let i=0;i<steps;i++) {
      const step=ECONOMY.step;
      const absoluteTime=s.society.startTime+(s.society.ticks+1)*step*24/ECONOMY.secondsPerDay;
      const nextDay=s.society.startDay+Math.floor(absoluteTime/24);
      s.time=absoluteTime%24;
      s.food=clamp(s.food-step*.018,0,100);s.energy=clamp(s.energy-step*.01,0,100);
      while(s.day<nextDay) {
        s.day++;
        if(s.rentPaid<s.day) {s.debt+=ECONOMY.rent;this.event('Loyer quotidien : 800 F à régler au logement.');}
        if(s.contract&&s.day>s.contract.deadline) {s.contract=null;s.rep=clamp(s.rep-2,0,100);this.event('Le contrat de livraison a expiré.');}
      }
      // A customer must choose the shop, walk there, afford and commit the purchase.
      // There is no periodic button or timer that grants the player sales.
      const events=tickSociety(s,step);
      if(Array.isArray(events))for(const message of events)this.event(typeof message==='string'?message:message.message);
    }
  }

  act(action,context={}) {
    const a=typeof action==='string'?{type:action}:action,s=this.state;
    const fail=message=>({ok:false,message});
    const pay=n=>{if(s.money<n)return false;s.money-=n;s.costs+=n;return true;};
    if(!a||typeof a.type!=='string')return fail('Action invalide.');
    if(locations[a.type]&&context.location!==locations[a.type])return fail('Approchez-vous du lieu correspondant.');
    const quantity=a.quantity??4;
    let message;
    switch(a.type) {
      case 'negotiate': {
        const result=negotiateSupplier(s,{price:a.price,quantity});
        // Rejections can change trust/memory. The caller saves these consequences too.
        if(result.message)this.event(result.message);
        return result;
      }
      case 'buy': {
        const result=buySupplier(s,quantity);
        if(!result.ok)return result;
        s.carriedCost+=result.cost;
        message=result.message||'Marchandises achetées : transportez-les au kiosque.';
        break;
      }
      case 'invest':
        if(s.biz)return fail('Votre kiosque est déjà ouvert.');
        if(!pay(ECONOMY.kioskCost))return fail('Il faut 9 000 F pour le kiosque.');
        s.biz=true;break;
      case 'deposit':
        if(!s.biz||!s.carried)return fail('Ouvrez le kiosque et transportez des marchandises.');
        s.stock+=s.carried;s.stockCost+=s.carriedCost;s.carried=0;s.carriedCost=0;break;
      case 'price':
        if(!s.biz||!Number.isInteger(a.price)||a.price<350||a.price>1200)return fail('Prix autorisé : 350 à 1 200 F.');
        s.price=a.price;break;
      case 'contract':
        if(s.lastContractDay===s.day)return fail('Une livraison par jour : revenez demain.');
        if(s.contract)return fail('Une livraison est déjà en cours.');
        s.lastContractDay=s.day;s.contract={origin:context.location,destination:'studio',deadline:s.day+1,reward:1200};break;
      case 'deliver':
        if(!s.contract)return fail('Aucun colis à livrer.');
        s.money+=s.contract.reward;s.completed++;s.experience+=4;s.rep=clamp(s.rep+2,0,100);s.contract=null;break;
      case 'meal':
        if(s.food>90)return fail('Vous êtes rassasié.');
        if(!pay(ECONOMY.meal))return fail('Fonds insuffisants.');
        s.food=clamp(s.food+35,0,100);break;
      case 'rent':
        if(s.debt===0)return fail('Votre loyer est à jour.');
        if(!pay(s.debt))return fail('Fonds insuffisants.');
        s.debt=0;s.rentPaid=s.day;break;
      case 'housing':
        if(s.home)return fail('Le logement est déjà aménagé.');
        if(!pay(4000))return fail('Aménagement : 4 000 F.');
        s.home=true;break;
      case 'rest':
        if(s.debt)return fail('Réglez le loyer avant de vous reposer.');
        s.energy=clamp(s.energy+(s.home?45:25),0,100);this.tick(60);break;
      case 'talk': {
        if(typeof context.npcId!=='string'||!context.npcId||context.npcId.length>64)return fail('Habitant inconnu.');
        if(s.conversations.includes(context.npcId))return fail('Nous avons déjà discuté. Revenez découvrir mon quartier.');
        s.conversations.push(context.npcId);s.conversations=s.conversations.slice(-100);
        const resident=s.society.agents.find(p=>p.id===context.npcId);
        if(resident) {resident.relationship=clamp(resident.relationship+3,0,100);resident.memory.lastReason='Le joueur a pris le temps de discuter.';if(resident.role==='supplier')s.society.supplier.trust=resident.relationship;}
        break;
      }
      default:return fail('Action inconnue.');
    }
    message??={invest:'Votre kiosque est ouvert.',deposit:'Stock livré : les habitants peuvent venir acheter.',
      price:'Prix mis à jour : les habitants comparent leurs budgets et le concurrent.',contract:'Colis confié : livrez-le au studio avant demain soir.',
      deliver:'Livraison terminée : 1 200 F gagnés.',meal:'Repas servi.',rest:'Vous êtes reposé.',rent:'Loyer réglé.',
      housing:'Votre logement est aménagé.',talk:'Votre échange est mémorisé. Chaque voisin compare besoins, budget et prix.'}[a.type];
    this.event(message);return {ok:true,message};
  }

  load(raw) {
    try {
      const input=typeof raw==='string'?JSON.parse(raw):raw;
      if(!input||typeof input!=='object'||Array.isArray(input))return false;
      const s=createState();
      if(input.version===undefined) {
        if(!Number.isFinite(input.money)||input.money<0||input.money>1e8)return false;
        s.money=input.money;if(typeof input.name==='string')s.name=input.name.slice(0,24);
        this.state=s;return true;
      }
      if(![2,3].includes(input.version))return false;
      for(const key of numericKeys) {
        if(!Number.isFinite(input[key])||input[key]<0||input[key]>1e9)return false;
        s[key]=input[key];
      }
      for(const key of ['day','carried','stock','price','sales','rentPaid','completed'])if(!Number.isInteger(s[key]))return false;
      if(s.day<1||s.time>=24||s.energy>100||s.food>100||s.rep>100||s.carried>12||s.price<350||s.price>1200)return false;
      if(typeof input.biz!=='boolean'||typeof input.home!=='boolean'||typeof input.name!=='string'||!['lome','kara','kpalime'].includes(input.city))return false;
      if(input.appearance!==undefined) {
        if(!input.appearance||!['#e8dfc6','#217d7b','#b9563e'].includes(input.appearance.shirt)||!['#633f2e','#936044','#b98259'].includes(input.appearance.skin))return false;
        s.appearance={shirt:input.appearance.shirt,skin:input.appearance.skin};
      }
      if(input.position!==undefined) {
        if(!input.position||!Number.isFinite(input.position.x)||!Number.isFinite(input.position.z)||Math.abs(input.position.x)>45||Math.abs(input.position.z)>42)return false;
        s.position={x:input.position.x,z:input.position.z};
      }
      if(input.lastContractDay!==undefined) {
        if(!Number.isInteger(input.lastContractDay)||input.lastContractDay<0||input.lastContractDay>s.day)return false;
        s.lastContractDay=input.lastContractDay;
      }
      s.biz=input.biz;s.home=input.home;s.name=input.name.slice(0,24);s.city=input.city;
      if(!Array.isArray(input.conversations)||input.conversations.length>100||Array.from(input.conversations).some(x=>typeof x!=='string'||x.length>64))return false;
      s.conversations=[...input.conversations];
      if(input.events!==undefined) {
        if(!Array.isArray(input.events)||input.events.length>8||Array.from(input.events).some(x=>typeof x!=='string'||x.length>240))return false;
        s.events=[...input.events];
      }
      if(input.contract!==null) {
        const c=input.contract;
        if(!c||c.origin!=='market'||c.destination!=='studio'||c.reward!==1200||!Number.isInteger(c.deadline)||c.deadline<s.day||c.deadline>s.day+1)return false;
        s.contract={origin:c.origin,destination:c.destination,reward:c.reward,deadline:c.deadline};
      }
      if(input.version===2) {
        // v2 only sold goods bought at350 F. Preserve quantities and derive that known basis.
        s.carriedCost=s.carried*ECONOMY.wholesale;s.stockCost=s.stock*ECONOMY.wholesale;s.goodsCostSold=s.sales*ECONOMY.wholesale;
        s.society.startDay=s.day;s.society.startTime=s.time;
      } else {
        for(const key of ['carriedCost','stockCost','goodsCostSold','stepRemainder']) {
          if(!Number.isFinite(input[key])||input[key]<0||input[key]>1e12)return false;
          s[key]=input[key];
        }
        if(s.stepRemainder>=ECONOMY.step||(!s.carried&&s.carriedCost!==0)||(!s.stock&&s.stockCost>.001))return false;
        const society=validateSociety(input.society);if(!society)return false;s.society=society;
      }
      this.state=s;return true;
    } catch {return false;}
  }
}
