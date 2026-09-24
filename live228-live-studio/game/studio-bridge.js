(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const userRegions = new Map();
  let liveViewers = 0;
  let studioMode = false;

  const REGION_ALIASES = [
    ['MARITIME', /\b(MARITIME|LOME|LOMÉ)\b/i],
    ['PLATEAUX', /\b(PLATEAUX|KPALIME|KPALIMÉ|ATAKPAME|ATAKPAMÉ)\b/i],
    ['CENTRALE', /\b(CENTRALE|SOKODE|SOKODÉ)\b/i],
    ['KARA', /\b(KARA)\b/i],
    ['SAVANES', /\b(SAVANES|DAPAONG)\b/i]
  ];

  function currentMatch() {
    return window.Live228?.getState?.().matchup || ['MARITIME','KARA'];
  }

  function parseRegion(text='') {
    for (const [region, rx] of REGION_ALIASES) if (rx.test(text)) return region;
    return null;
  }

  function balancedRegion() {
    const state = window.Live228?.getState?.();
    const [a,b] = state?.matchup || ['MARITIME','KARA'];
    const counts = { [a]:0, [b]:0 };
    for (const p of state?.players || []) if (counts[p.region] !== undefined) counts[p.region]++;
    if (counts[a] === counts[b]) return Math.random() > .5 ? a : b;
    return counts[a] < counts[b] ? a : b;
  }

  function regionFor(user, explicit=null) {
    const key=(user?.name || 'invite').toLowerCase();
    if (explicit && currentMatch().includes(explicit)) {
      userRegions.set(key, explicit);
      return explicit;
    }
    const old=userRegions.get(key);
    if (old && currentMatch().includes(old)) return old;
    const next=balancedRegion();
    userRegions.set(key,next);
    return next;
  }

  function dispatch(event) {
    if (!event) return;
    if (event.type === 'viewers') {
      liveViewers = Number(event.viewers || 0);
      window.Live228?.setExternalStats?.({ viewers: liveViewers });
      return;
    }

    const user=event.user || {};
    if (event.type === 'comment') {
      const explicit=parseRegion(event.text || '');
      const region=regionFor(user, explicit);
      if (explicit && currentMatch().includes(explicit)) {
        window.Live228?.pushEvent?.({ type:'join', user, region });
      }
      window.Live228?.pushEvent?.({ type:'comment', user, region, text:event.text || '🔥' });
      return;
    }

    const region=regionFor(user, event.region || null);
    if (event.type === 'member') window.Live228?.pushEvent?.({ type:'join', user, region });
    if (event.type === 'like') window.Live228?.pushEvent?.({ type:'like', user, region, count:event.count || 1 });
    if (event.type === 'follow') window.Live228?.pushEvent?.({ type:'follow', user, region });
    if (event.type === 'share') window.Live228?.pushEvent?.({ type:'share', user, region });
    if (event.type === 'gift') window.Live228?.pushEvent?.({
      type:'gift', user, region, gift:event.gift || 'rose',
      giftName:event.giftName || '', diamonds:Number(event.diamonds || 0),
      repeatCount:Number(event.repeatCount || 1)
    });
  }

  function showMessage(text, error=false) {
    if (!$('bridgeMessage')) return;
    $('bridgeMessage').textContent=text || '';
    $('bridgeMessage').classList.toggle('error', error);
  }

  function setStatus(s={}) {
    const badge=$('bridgeStatus'), label=$('bridgeStatusText');
    const username=s.username ? '@'+s.username : '';
    const map={
      idle:'Prêt',
      connecting:'Connexion…',
      waiting:'En attente du LIVE',
      connected:`Connecté ${username}`,
      reconnecting:'Reconnexion…',
      disconnected:'Déconnecté',
      ended:'LIVE terminé',
      error:'Erreur'
    };
    if (badge) {
      badge.dataset.state=s.state || 'idle';
      badge.textContent=s.state==='connected'?'● LIVE':'●';
    }
    if (label) label.textContent=map[s.state] || s.state || 'Prêt';
    if ($('connectTikTok')) $('connectTikTok').disabled=['connecting'].includes(s.state);
    if ($('disconnectTikTok')) $('disconnectTikTok').disabled=!['connected','connecting','waiting','reconnecting'].includes(s.state);
    if (s.viewers !== undefined) {
      liveViewers=Number(s.viewers || 0);
      window.Live228?.setExternalStats?.({viewers:liveViewers});
    }
    window.Live228?.setLiveConnected?.(s.state==='connected');
    if (s.message) showMessage(s.message, s.state==='error');
  }

  async function connect() {
    const username=$('tiktokUsername')?.value?.trim();
    if (!username) return showMessage('Entre ton @username TikTok.', true);
    showMessage('Connexion au LIVE…');
    await window.LIVE228Desktop?.connect?.(username);
  }

  async function disconnect() {
    await window.LIVE228Desktop?.disconnect?.();
  }

  async function toggleStudio() {
    studioMode=!studioMode;
    document.documentElement.classList.toggle('obs-mode', studioMode);
    await window.LIVE228Desktop?.setStudioMode?.(studioMode);
  }

  $('connectTikTok')?.addEventListener('click', connect);
  $('disconnectTikTok')?.addEventListener('click', disconnect);
  $('studioMode')?.addEventListener('click', toggleStudio);
  $('tiktokUsername')?.addEventListener('keydown', e => { if(e.key==='Enter') connect(); });

  window.LIVE228Desktop?.onEvent?.(dispatch);
  window.LIVE228Desktop?.onStatus?.(setStatus);
  window.LIVE228Desktop?.onStudioMode?.((enabled)=>{
    studioMode=Boolean(enabled);
    document.documentElement.classList.toggle('obs-mode', studioMode);
  });

  window.addEventListener('keydown', e=>{
    if(e.key==='F1') {
      e.preventDefault();
      studioMode=!studioMode;
      document.documentElement.classList.toggle('obs-mode', studioMode);
    }
  });

  window.Live228Bridge = {
    dispatch,
    clearTeams:()=>userRegions.clear(),
    getViewerCount:()=>liveViewers
  };

  window.LIVE228Desktop?.getStatus?.().then(setStatus);
})();
