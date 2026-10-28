/* Shared protocol for sandboxed wallpapers. Only the owning parent can control it. */
(function () {
  'use strict';
  const embedded = parent !== window && new URLSearchParams(location.search).get('embed') === '1';
  let api = null;
  const send = (type, data = {}) => { if (embedded) parent.postMessage({type, ...data}, '*'); };
  const state = () => { if (api) send('wallpaper-state', {state: api.getState?.() || {}}); };
  const error = message => send('wallpaper-error', {message: String(message)});
  window.WallpaperBridge = {
    state, error,
    register(value) {
      api = value;
      send('wallpaper-ready', {state: api.getState?.() || {}, capabilities: {snapshot: typeof api.snapshot === 'function'}});
      return {state, error};
    }
  };
  addEventListener('message', async event => {
    if (!embedded || event.source !== parent || event.data?.type !== 'wallpaper-control' || !api) return;
    const {command, value, requestId} = event.data;
    try {
      if (command === 'playing' && typeof value === 'boolean') await api.setPlaying?.(value);
      else if (command === 'settings' && value && typeof value === 'object') await api.setSettings?.(value);
      else if (command === 'reset') await api.reset?.();
      else if (command === 'action' && value && Object.hasOwn(api.actions || {}, value.key)) await api.actions[value.key](value.value);
      else if (command === 'snapshot') {
        const url = await api.snapshot?.();
        send('wallpaper-snapshot', {requestId, url});
        return;
      }
      state();
    } catch (err) {
      if (command === 'snapshot') send('wallpaper-snapshot', {requestId, error: String(err)});
      else error(err.message || err);
    }
  });
  addEventListener('keydown', event => {
    if (!embedded || event.ctrlKey || event.metaKey || event.altKey || event.repeat || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (['Escape','h','H','m','M','f','F',' ','ArrowLeft','ArrowRight'].includes(event.key)) {
      event.preventDefault();event.stopImmediatePropagation();
      send('wallpaper-key', {key: event.key, code: event.code});
    }
  }, true);
})();
