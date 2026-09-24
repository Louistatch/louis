(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const userRegions = new Map();
  let bridgeAvailable = typeof window.AndroidLive !== 'undefined';
  let liveViewers = 0;

  const REGION_ALIASES = [
    ['MARITIME', /\b(MARITIME|LOME|LOMÉ)\b/i],
    ['PLATEAUX', /\b(PLATEAUX|KPALIME|KPALIMÉ|ATAKPAME|ATAKPAMÉ)\b/i],
    ['CENTRALE', /\b(CENTRALE|SOKODE|SOKODÉ)\b/i],
    ['KARA', /\b(KARA)\b/i],
    ['SAVANES', /\b(SAVANES|DAPAONG)\b/i]
  ];

  function normalizeName(user = {}) {
    return user.name || user.uniqueId || '@invite';
  }

  function parseRegion(text = '') {
    for (const [region, rx] of REGION_ALIASES) {
      if (rx.test(text)) return region;
    }
    return null;
  }

  function currentMatch() {
    try {
      return window.Live228?.getState?.().matchup || ['MARITIME', 'KARA'];
    } catch {
      return ['MARITIME', 'KARA'];
    }
  }

  function balancedRegion() {
    const state = window.Live228?.getState?.();
    const [a, b] = state?.matchup || ['MARITIME', 'KARA'];
    const counts = { [a]: 0, [b]: 0 };
    for (const p of state?.players || []) {
      if (counts[p.region] !== undefined) counts[p.region] += 1;
    }
    if (counts[a] === counts[b]) return Math.random() > 0.5 ? a : b;
    return counts[a] < counts[b] ? a : b;
  }

  function validMatchRegion(region) {
    return currentMatch().includes(region);
  }

  function regionFor(user, explicitRegion = null) {
    const name = normalizeName(user).toLowerCase();
    if (explicitRegion && validMatchRegion(explicitRegion)) {
      userRegions.set(name, explicitRegion);
      return explicitRegion;
    }
    const stored = userRegions.get(name);
    if (stored && validMatchRegion(stored)) return stored;
    const fallback = balancedRegion();
    userRegions.set(name, fallback);
    return fallback;
  }

  function dispatch(event) {
    if (!window.Live228?.pushEvent || !event) return;
    const user = event.user || {};

    if (event.type === 'comment') {
      const explicit = parseRegion(event.text || '');
      const region = regionFor(user, explicit);
      if (explicit && validMatchRegion(explicit)) {
        window.Live228.pushEvent({ type: 'join', user, region });
      }
      window.Live228.pushEvent({ type: 'comment', user, region, text: event.text || '🔥' });
      return;
    }

    if (event.type === 'member') {
      const region = regionFor(user);
      window.Live228.pushEvent({ type: 'join', user, region });
      return;
    }

    const region = regionFor(user, event.region || null);
    if (event.type === 'like') {
      window.Live228.pushEvent({ type: 'like', user, region, count: event.count || 1 });
    } else if (event.type === 'follow') {
      window.Live228.pushEvent({ type: 'follow', user, region });
    } else if (event.type === 'share') {
      window.Live228.pushEvent({ type: 'share', user, region });
    } else if (event.type === 'gift') {
      window.Live228.pushEvent({
        type: 'gift',
        user,
        region,
        gift: (event.gift || 'rose').toLowerCase(),
        giftName: event.giftName || '',
        diamonds: Number(event.diamonds || 0),
        repeatCount: Number(event.repeatCount || 1)
      });
    }
  }

  function setStatus(status = {}) {
    const badge = $('bridgeStatus');
    const statusText = $('bridgeStatusText');
    const connectBtn = $('connectTikTok');
    const disconnectBtn = $('disconnectTikTok');
    const username = status.username ? `@${status.username}` : '';
    const labelMap = {
      idle: 'Prêt',
      connecting: 'Connexion…',
      permission: 'Autorisation Android',
      launching: 'TikTok ouvert',
      waiting: 'En attente du LIVE',
      connected: `Connecté ${username}`.trim(),
      reconnecting: 'Reconnexion…',
      disconnected: 'Déconnecté',
      ended: 'LIVE terminé',
      error: 'Erreur de connexion'
    };
    const label = labelMap[status.state] || status.state || 'Prêt';
    if (badge) {
      badge.dataset.state = status.state || 'idle';
      badge.textContent = status.state === 'connected' ? '● LIVE' : '●';
    }
    if (statusText) statusText.textContent = label;
    if (connectBtn) connectBtn.disabled = ['connecting','launching'].includes(status.state);
    if (disconnectBtn) disconnectBtn.disabled = !['connected', 'connecting', 'reconnecting', 'error', 'ended', 'disconnected'].includes(status.state);
    window.Live228?.setLiveConnected?.(status.state === 'connected');
    if (status.lastError) showBridgeMessage(status.lastError, true);
  }

  function showBridgeMessage(text, isError = false) {
    const el = $('bridgeMessage');
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('error', Boolean(isError));
  }

  function connectFromUI() {
    const username = $('tiktokUsername')?.value?.trim();
    if (!username) {
      showBridgeMessage('Entre ton @username TikTok.', true);
      return;
    }
    if (!bridgeAvailable) {
      showBridgeMessage('Pont Android indisponible. Réinstalle l’APK autonome.', true);
      return;
    }
    showBridgeMessage('Préparation du mode LIVE228 par-dessus TikTok…');
    setStatus({ state: 'launching', username: username.replace(/^@/, '') });
    try {
      if (typeof window.AndroidLive.startSmartLive === 'function') window.AndroidLive.startSmartLive(username);
      else window.AndroidLive.connect(username);
    } catch (err) {
      showBridgeMessage(err?.message || String(err), true);
      setStatus({ state: 'error', lastError: String(err) });
    }
  }

  function disconnectFromUI() {
    if (!bridgeAvailable) return;
    try {
      window.AndroidLive.disconnect();
      setStatus({ state: 'disconnected' });
      showBridgeMessage('Connexion TikTok arrêtée. Le simulateur reste disponible.');
    } catch (err) {
      showBridgeMessage(err?.message || String(err), true);
    }
  }

  $('connectTikTok')?.addEventListener('click', connectFromUI);
  $('disconnectTikTok')?.addEventListener('click', disconnectFromUI);
  $('openTikTok')?.addEventListener('click', () => {
    try { window.AndroidLive?.openTikTok?.(); } catch (_) {}
  });
  $('tiktokUsername')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') connectFromUI();
  });

  window.Live228NativeEvent = (payload) => {
    try {
      const event = typeof payload === 'string' ? JSON.parse(payload) : payload;
      dispatch(event);
    } catch (err) {
      console.error('LIVE228 native event error', err, payload);
    }
  };

  window.Live228NativeStatus = (payload) => {
    try {
      const status = typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (status.viewers !== undefined) {
        liveViewers = Number(status.viewers || 0);
        window.Live228?.setExternalStats?.({ viewers: liveViewers });
      }
      setStatus(status);
      if (status.message) showBridgeMessage(status.message, status.state === 'error');
    } catch (err) {
      console.error('LIVE228 native status error', err, payload);
    }
  };

  window.Live228Bridge = {
    isAvailable: () => bridgeAvailable,
    dispatch,
    parseRegion,
    getViewerCount: () => liveViewers,
    clearTeams: () => userRegions.clear()
  };

  if (bridgeAvailable) {
    setStatus({ state: 'idle' });
    showBridgeMessage('Entre ton @TikTok puis touche « Lancer avec TikTok ». LIVE228 restera actif en bulle et détectera automatiquement le LIVE.');
  } else {
    setStatus({ state: 'error' });
    showBridgeMessage('Pont Android introuvable.', true);
  }
})();
