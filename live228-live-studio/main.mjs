import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win = null;
let connection = null;
let activeUsername = '';
let manualStop = false;
let connectGeneration = 0;
let retryTimer = null;
let studioMode = false;

let status = {
  state: 'idle',
  username: '',
  message: 'Prêt pour TikTok LIVE Studio.',
  roomId: '',
  viewers: 0,
  retries: 0
};

function send(channel, payload) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function setStatus(patch) {
  status = { ...status, ...patch };
  send('live-status', status);
}

function clearRetry() {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
}

async function safeDisconnect() {
  const current = connection;
  connection = null;
  if (current) {
    try { await current.disconnect(); } catch {}
  }
}

function userPayload(data) {
  return {
    name: data?.user?.uniqueId || data?.user?.nickname || 'invite'
  };
}

function scheduleRetry(generation) {
  if (manualStop || generation !== connectGeneration) return;
  clearRetry();
  const n = status.retries || 0;
  const delay = n < 4 ? 4000 : n < 10 ? 7000 : 12000;
  retryTimer = setTimeout(() => attemptConnect(generation), delay);
}

async function attemptConnect(generation) {
  if (manualStop || generation !== connectGeneration || !activeUsername) return;

  await safeDisconnect();

  setStatus({
    state: 'waiting',
    username: activeUsername,
    message: `Recherche du LIVE @${activeUsername}…`,
    retries: (status.retries || 0) + 1
  });

  const conn = new TikTokLiveConnection(activeUsername, {
    enableExtendedGiftInfo: true,
    processInitialData: false,
    fetchRoomInfoOnConnect: true,
    webClientOptions: { timeout: { request: 12000 } },
    wsClientOptions: { handshakeTimeout: 12000 }
  });
  connection = conn;

  conn.on(ControlEvent.CONNECTED, () => {
    if (generation !== connectGeneration) return;
    setStatus({
      state: 'connected',
      username: activeUsername,
      message: 'LIVE connecté — interactions actives.',
      roomId: conn.roomId || '',
      retries: 0
    });
  });

  conn.on(ControlEvent.DISCONNECTED, () => {
    if (manualStop || generation !== connectGeneration) return;
    setStatus({ state: 'reconnecting', message: 'Connexion perdue — reconnexion automatique…' });
    scheduleRetry(generation);
  });

  conn.on(ControlEvent.ERROR, (err) => {
    if (manualStop || generation !== connectGeneration) return;
    const msg = err?.message || err?.toString?.() || 'Erreur TikTok LIVE';
    setStatus({ state: 'waiting', message: msg });
  });

  conn.on(WebcastEvent.MEMBER, (data) => {
    send('live-event', { type: 'member', user: userPayload(data) });
  });

  conn.on(WebcastEvent.CHAT, (data) => {
    send('live-event', { type: 'comment', user: userPayload(data), text: data?.comment || '' });
  });

  conn.on(WebcastEvent.LIKE, (data) => {
    send('live-event', {
      type: 'like',
      user: userPayload(data),
      count: Number(data?.likeCount || 1)
    });
  });

  conn.on(WebcastEvent.FOLLOW, (data) => {
    send('live-event', { type: 'follow', user: userPayload(data) });
  });

  conn.on(WebcastEvent.SHARE, (data) => {
    send('live-event', { type: 'share', user: userPayload(data) });
  });

  conn.on(WebcastEvent.ROOM_USER, (data) => {
    const viewers = Number(data?.viewerCount || 0);
    setStatus({ viewers });
    send('live-event', { type: 'viewers', viewers });
  });

  conn.on(WebcastEvent.GIFT, (data) => {
    const giftType = Number(data?.giftDetails?.giftType || 0);
    if (giftType === 1 && !data?.repeatEnd) return;

    const giftName =
      data?.giftDetails?.giftName ||
      data?.extendedGiftInfo?.name ||
      'Gift';

    const diamonds = Number(
      data?.extendedGiftInfo?.diamond_count ??
      data?.extendedGiftInfo?.diamondCount ??
      0
    );

    send('live-event', {
      type: 'gift',
      user: userPayload(data),
      gift: diamonds >= 100 ? 'star' : 'rose',
      giftName,
      diamonds,
      repeatCount: Number(data?.repeatCount || 1)
    });
  });

  conn.on(WebcastEvent.STREAM_END, () => {
    if (generation !== connectGeneration) return;
    setStatus({ state: 'ended', message: 'Le LIVE est terminé.', viewers: 0 });
  });

  try {
    const state = await conn.connect();
    if (generation !== connectGeneration) {
      await safeDisconnect();
      return;
    }
    setStatus({
      state: 'connected',
      username: activeUsername,
      roomId: state?.roomId || conn.roomId || '',
      message: 'LIVE connecté — commentaires, likes et cadeaux pilotent le jeu.'
    });
  } catch (error) {
    if (generation !== connectGeneration || manualStop) return;
    const message = error?.message || String(error);
    setStatus({
      state: 'waiting',
      username: activeUsername,
      message: /offline|not found|unknown/i.test(message)
        ? `@${activeUsername} n'est pas encore détecté en LIVE. LIVE228 réessaie automatiquement.`
        : message
    });
    scheduleRetry(generation);
  }
}

async function connectLive(raw) {
  const username = String(raw || '').trim().replace(/^@/, '');
  if (!username) {
    setStatus({ state: 'error', message: 'Entre ton @username TikTok.' });
    return status;
  }

  manualStop = false;
  activeUsername = username;
  connectGeneration += 1;
  clearRetry();

  setStatus({
    state: 'connecting',
    username,
    message: 'Connexion à TikTok LIVE…',
    retries: 0,
    roomId: '',
    viewers: 0
  });

  attemptConnect(connectGeneration);
  return status;
}

async function disconnectLive() {
  manualStop = true;
  connectGeneration += 1;
  clearRetry();
  await safeDisconnect();
  setStatus({
    state: 'disconnected',
    message: 'Connexion TikTok arrêtée.',
    roomId: '',
    viewers: 0,
    retries: 0
  });
  return status;
}

function applyStudioMode(enabled) {
  studioMode = Boolean(enabled);
  if (!win || win.isDestroyed()) return;
  if (studioMode) {
    win.setResizable(true);
    win.setMinimumSize(360, 640);
    win.setSize(540, 960, true);
  } else {
    win.setMinimumSize(900, 720);
    win.setSize(1180, 900, true);
  }
  send('studio-mode', studioMode);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 900,
    minWidth: 900,
    minHeight: 720,
    backgroundColor: '#030711',
    title: 'LIVE228 Clash Studio',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, 'game', 'index.html'));
  win.on('closed', () => { win = null; });
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('F1', () => applyStudioMode(!studioMode));

  ipcMain.handle('live-connect', (_event, username) => connectLive(username));
  ipcMain.handle('live-disconnect', () => disconnectLive());
  ipcMain.handle('live-status', () => status);
  ipcMain.handle('studio-mode', (_event, enabled) => {
    applyStudioMode(enabled);
    return studioMode;
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  clearRetry();
  safeDisconnect();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
