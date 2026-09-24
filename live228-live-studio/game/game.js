(() => {
  'use strict';

  const REGIONS = {
    MARITIME:{emoji:'🌊',color:'#25f4ee'},
    PLATEAUX:{emoji:'⛰️',color:'#ffd95a'},
    CENTRALE:{emoji:'🌳',color:'#78f48c'},
    KARA:{emoji:'🦁',color:'#ff6a6a'},
    SAVANES:{emoji:'🌾',color:'#c790ff'}
  };
  const $ = id => document.getElementById(id);
  const canvas = $('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const state = {
    teamA:'MARITIME', teamB:'KARA',
    score:{A:0,B:0}, energy:{A:0,B:0},
    likes:0,gifts:0,comments:0,shares:0,viewers:0,
    liveConnected:false,secondsLeft:148,roundRunning:true,
    players:[],nextId:1,
    ball:{x:W/2,y:H/2,vx:1.8,vy:0.8,r:18},
    last:performance.now()
  };

  const teamFor = r => r===state.teamA?'A':r===state.teamB?'B':null;
  const rndName = () => ['Kossi','Ama','Afi','Kodjo','Yawa','Komlan','Essi','Koffi','Mawuli','Abla'][Math.floor(Math.random()*10)] + Math.floor(10+Math.random()*90);
  const initials = n => (n||'?').replace(/^@/,'').slice(0,2).toUpperCase();

  function feed(text){
    const el=document.createElement('div');
    el.className='event-line'; el.textContent=text;
    $('eventFeed').prepend(el);
    while($('eventFeed').children.length>5) $('eventFeed').lastChild.remove();
    setTimeout(()=>el.remove(),5000);
  }
  function special(text){
    const el=$('specialBanner'); el.textContent=text; el.classList.add('show');
    clearTimeout(special.t); special.t=setTimeout(()=>el.classList.remove('show'),1000);
  }
  function loadAvatar(p,url){
    if(!url) return;
    const img=new Image(); img.referrerPolicy='no-referrer'; img.src=url;
    img.onload=()=>p.avatar=img;
  }
  function addPlayer(name,region,avatarUrl){
    const team=teamFor(region); if(!team) return null;
    let p=state.players.find(x=>x.name.toLowerCase()===name.toLowerCase());
    if(p){p.region=region;p.team=team;p.points+=5;if(avatarUrl&&!p.avatar)loadAvatar(p,avatarUrl);return p;}
    if(state.players.length>=60) state.players.shift();
    p={id:state.nextId++,name,region,team,points:10,likes:0,
      x:70+Math.random()*(W-140),y:team==='A'?H*.68+Math.random()*150:H*.16+Math.random()*150,
      vx:0,vy:0,r:28,avatar:null,boostUntil:0,shieldUntil:0};
    if(avatarUrl) loadAvatar(p,avatarUrl);
    state.players.push(p); feed(`${REGIONS[region].emoji} ${name} rejoint ${region}`);
    return p;
  }
  function getOrAdd(name,region,avatar){return state.players.find(p=>p.name.toLowerCase()===name.toLowerCase())||addPlayer(name,region,avatar);}
  function like(name,region,count,avatar){
    const p=getOrAdd(name,region,avatar); if(!p)return;
    count=Math.max(1,Number(count)||1);p.likes+=count;p.points+=count;state.likes+=count;
    state.energy[p.team]=Math.min(100,state.energy[p.team]+Math.max(1,count*.35));p.boostUntil=performance.now()+850;hud();
  }
  function comment(name,region,text,avatar){
    const p=getOrAdd(name,region,avatar);if(!p)return;
    p.points+=12;state.comments++;state.energy[p.team]=Math.min(100,state.energy[p.team]+4);p.boostUntil=performance.now()+1500;
    feed(`💬 ${name}: ${text||'🔥'}`);hud();
  }
  function follow(name,region,avatar){
    const p=getOrAdd(name,region,avatar);if(!p)return;
    p.points+=30;p.shieldUntil=performance.now()+7000;state.energy[p.team]=Math.min(100,state.energy[p.team]+10);
    feed(`🛡️ ${name} follow : bouclier 7 s`);hud();
  }
  function share(name,region,avatar){
    const p=getOrAdd(name,region,avatar);if(!p)return;
    p.points+=45;state.shares++;p.boostUntil=performance.now()+3500;state.energy[p.team]=Math.min(100,state.energy[p.team]+14);
    feed(`↗️ ${name} partage le LIVE`);hud();
  }
  function gift(name,region,type,avatar,meta={}){
    const p=getOrAdd(name,region,avatar);if(!p)return;state.gifts++;
    const diamonds=Number(meta.diamonds||0);
    const big=type==='star'||diamonds>=100;
    p.points+=big?250:80;state.energy[p.team]=Math.min(100,state.energy[p.team]+(big?35:18));
    state.ball.vy+=(p.team==='A'?-1:1)*(big?18:12);state.ball.vx+=(Math.random()-.5)*(big?12:7);
    special(big?`⭐ POWER MODE ${REGIONS[region].emoji}`:`🌹 SUPER TIR ${REGIONS[region].emoji}`);
    feed(`${big?'⭐':'🌹'} ${name} • ${meta.giftName||'cadeau'}`);hud();
  }

  function resetBall(){state.ball.x=W/2;state.ball.y=H/2;state.ball.vx=(Math.random()-.5)*4;state.ball.vy=(Math.random()-.5)*4;}
  function restart(){
    state.score={A:0,B:0};state.energy={A:0,B:0};state.likes=0;state.gifts=0;state.comments=0;state.shares=0;
    state.secondsLeft=148;state.roundRunning=true;state.players=[];resetBall();$('roundOverlay').classList.add('hidden');
    window.Live228Bridge?.clearTeams?.(); if(!state.liveConnected) seed();hud();
  }
  function goal(team){
    state.score[team]++;special(`⚽ BUUUT — ${team==='A'?state.teamA:state.teamB} !`);
    feed(`⚽ BUT POUR ${team==='A'?state.teamA:state.teamB}`);resetBall();hud();
  }
  function seed(){for(let i=0;i<5;i++)addPlayer(rndName(),state.teamA);for(let i=0;i<5;i++)addPlayer(rndName(),state.teamB);}

  function physics(now,dt){
    for(const p of state.players){
      const dx=state.ball.x-p.x,dy=state.ball.y-p.y,d=Math.max(1,Math.hypot(dx,dy));
      const accel=now<p.boostUntil?.42:.25;
      p.vx+=(dx/d)*accel;p.vy+=(dy/d)*accel;
      const sp=Math.hypot(p.vx,p.vy),max=now<p.boostUntil?5.8:4.2;
      if(sp>max){p.vx=p.vx/sp*max;p.vy=p.vy/sp*max;}
      p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;
      p.x=Math.max(35,Math.min(W-35,p.x));p.y=Math.max(80,Math.min(H-80,p.y));
      const bx=state.ball.x-p.x,by=state.ball.y-p.y,bd=Math.max(1,Math.hypot(bx,by)),min=p.r+state.ball.r;
      if(bd<min){
        const nx=bx/bd,ny=by/bd,attack=p.team==='A'?-1:1;
        state.ball.x+=nx*(min-bd);state.ball.y+=ny*(min-bd);
        state.ball.vx+=nx*2.6;state.ball.vy+=ny*2.2+attack*(now<p.boostUntil?3.9:2.5);
      }
    }
    const b=state.ball;b.x+=b.vx;b.y+=b.vy;b.vx*=.994;b.vy*=.994;
    if(b.x<b.r||b.x>W-b.r){b.vx*=-1;b.x=Math.max(b.r,Math.min(W-b.r,b.x));}
    if(b.y<30&&b.x>W/2-120&&b.x<W/2+120) goal('A');
    else if(b.y>H-30&&b.x>W/2-120&&b.x<W/2+120) goal('B');
    else if(b.y<b.r||b.y>H-b.r){b.vy*=-1;b.y=Math.max(b.r,Math.min(H-b.r,b.y));}
    state.energy.A=Math.max(0,state.energy.A-dt*.0013);state.energy.B=Math.max(0,state.energy.B-dt*.0013);
  }

  function pitch(){
    ctx.fillStyle='#0b7a45';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=4;
    ctx.strokeRect(28,28,W-56,H-56);ctx.beginPath();ctx.moveTo(28,H/2);ctx.lineTo(W-28,H/2);ctx.stroke();
    ctx.beginPath();ctx.arc(W/2,H/2,95,0,Math.PI*2);ctx.stroke();
    ctx.strokeRect(W/2-135,28,270,100);ctx.strokeRect(W/2-135,H-128,270,100);
    ctx.fillStyle='rgba(255,255,255,.16)';ctx.font='900 25px system-ui';ctx.textAlign='center';
    ctx.fillText(`${REGIONS[state.teamB].emoji} ${state.teamB}`,W/2,85);
    ctx.fillText(`${REGIONS[state.teamA].emoji} ${state.teamA}`,W/2,H-65);
  }
  function drawPlayer(p,now){
    if(now<p.shieldUntil){ctx.beginPath();ctx.arc(p.x,p.y,p.r+10,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();}
    ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.clip();
    if(p.avatar)ctx.drawImage(p.avatar,p.x-p.r,p.y-p.r,p.r*2,p.r*2);
    else{ctx.fillStyle=REGIONS[p.region].color;ctx.fillRect(p.x-p.r,p.y-p.r,p.r*2,p.r*2);ctx.fillStyle='#06111f';ctx.font='900 18px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(initials(p.name),p.x,p.y);}
    ctx.restore();ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.strokeStyle=REGIONS[p.region].color;ctx.lineWidth=4;ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='700 14px system-ui';ctx.textAlign='center';ctx.fillText(p.name.slice(0,12),p.x,p.y+p.r+18);
    ctx.fillStyle='#ffe171';ctx.font='900 13px system-ui';ctx.fillText(Math.round(p.points),p.x,p.y-p.r-7);
  }
  function drawBall(){const b=state.ball;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=2;ctx.stroke();ctx.font='18px system-ui';ctx.fillStyle='#111';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('⚽',b.x,b.y);}
  function frame(now){const dt=Math.min(32,now-state.last);state.last=now;if(state.roundRunning)physics(now,dt);pitch();state.players.forEach(p=>drawPlayer(p,now));drawBall();requestAnimationFrame(frame);}

  function hud(){
    $('teamAName').textContent=`${REGIONS[state.teamA].emoji} ${state.teamA}`;$('teamBName').textContent=`${REGIONS[state.teamB].emoji} ${state.teamB}`;
    $('teamAScore').textContent=state.score.A;$('teamBScore').textContent=state.score.B;
    $('energyA').style.width=state.energy.A+'%';$('energyB').style.width=state.energy.B+'%';
    $('energyAText').textContent=Math.round(state.energy.A);$('energyBText').textContent=Math.round(state.energy.B);
    $('livePlayers').textContent=state.players.length;$('likesTotal').textContent=state.likes.toLocaleString('fr-FR');
    $('giftsTotal').textContent=state.gifts;$('commentsTotal').textContent=state.comments;$('sharesTotal').textContent=state.shares;$('viewersTotal').textContent=state.viewers.toLocaleString('fr-FR');
    $('timer').textContent=String(Math.floor(state.secondsLeft/60)).padStart(2,'0')+':'+String(state.secondsLeft%60).padStart(2,'0');
    const top=[...state.players].sort((a,b)=>b.points-a.points).slice(0,3);
    $('leaderboardList').innerHTML=top.map((p,i)=>`<li>${['🥇','🥈','🥉'][i]} ${p.name.replace(/[<>&]/g,'')} · ${Math.round(p.points)}</li>`).join('');
  }

  setInterval(()=>{if(!state.roundRunning)return;state.secondsLeft--;if(state.secondsLeft<=0){state.secondsLeft=0;state.roundRunning=false;const a=state.score.A,b=state.score.B;$('roundResult').textContent=a===b?'ÉGALITÉ 🤝':a>b?`${REGIONS[state.teamA].emoji} ${state.teamA} GAGNE !`:`${REGIONS[state.teamB].emoji} ${state.teamB} GAGNE !`;$('roundSummary').textContent=`${a} — ${b} • ${state.likes.toLocaleString('fr-FR')} likes • ${state.gifts} cadeaux`;$('roundOverlay').classList.remove('hidden');}hud();},1000);

  function fill(sel,selected){sel.innerHTML=Object.keys(REGIONS).map(r=>`<option value="${r}" ${r===selected?'selected':''}>${REGIONS[r].emoji} ${r}</option>`).join('');}
  document.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=()=>{
    const n=($('username').value||'Invité').trim(),r=$('regionSelect').value,a=btn.dataset.action;
    if(a==='join')addPlayer(n,r);if(a==='like')like(n,r,10);if(a==='comment')comment(n,r,'On pousse ! 🔥');if(a==='follow')follow(n,r);if(a==='share')share(n,r);if(a==='rose')gift(n,r,'rose');if(a==='star')gift(n,r,'star');hud();
  });
  $('restartRound').onclick=restart;
  $('applyMatchup').onclick=()=>{const a=$('teamASelect').value,b=$('teamBSelect').value;if(a===b){alert('Choisis deux régions différentes.');return;}state.teamA=a;state.teamB=b;fill($('regionSelect'),a);restart();};
  $('fullscreenBtn').onclick=async()=>{try{if(!document.fullscreenElement)await document.querySelector('.live-stage').requestFullscreen();else await document.exitFullscreen();}catch(_){}};

  window.Live228={
    pushEvent(event){
      if(!event?.type)return;const u=event.user||{},name=u.name||u.uniqueId||'Invité',region=(event.region||u.region||state.teamA).toUpperCase(),avatar=u.avatarUrl||null;
      if(event.type==='join')addPlayer(name,region,avatar);
      if(event.type==='like')like(name,region,event.count||1,avatar);
      if(event.type==='comment')comment(name,region,event.text||'🔥',avatar);
      if(event.type==='follow')follow(name,region,avatar);
      if(event.type==='share')share(name,region,avatar);
      if(event.type==='gift')gift(name,region,(Number(event.diamonds||0)>=100?'star':'rose'),avatar,event);
      hud();
    },
    getState(){return {matchup:[state.teamA,state.teamB],players:state.players.map(p=>({name:p.name,region:p.region,team:p.team,points:p.points}))};},
    setExternalStats(stats={}){if(Number.isFinite(Number(stats.viewers)))state.viewers=Math.max(0,Number(stats.viewers));hud();},
    setLiveConnected(v){v=!!v;if(v===state.liveConnected)return;state.liveConnected=v;restart();feed(v?'🔴 TikTok LIVE connecté — vrais spectateurs uniquement.':'🧪 Mode simulation réactivé.');}
  };

  fill($('regionSelect'),state.teamA);fill($('teamASelect'),state.teamA);fill($('teamBSelect'),state.teamB);seed();hud();requestAnimationFrame(frame);
})();
