import { Link } from 'react-router-dom'

export function PhoneMockup({ variant }: { variant: 'phones' | 'pay' | 'credit' }) {
  if (variant === 'pay') {
    return (
      <div className="phones">
        <div className="phone phone-back" aria-hidden="true">
          <ScreenHome />
        </div>
        <div className="phone phone-front" aria-hidden="true">
          <div className="phone-screen">
            <div className="app-qr">
              <strong>MegoPay</strong>
              <div className="qr-box" />
              <span style={{ fontSize: 11, fontWeight: 700 }}>Cobra con QR</span>
              <div className="app-pay" style={{ width: '100%' }}>
                <button className="cobrar" type="button">
                  Cobrar
                </button>
                <button className="pagar" type="button">
                  Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'credit') {
    return (
      <div className="phones">
        <div className="phone phone-front" aria-hidden="true" style={{ right: '22%' }}>
          <div className="phone-screen" style={{ padding: 16, background: '#fff' }}>
            <div className="app-status">
              <span>9:41</span>
              <span>5G</span>
            </div>
            <p className="kicker">Crédito vivienda</p>
            <h3 style={{ margin: '8px 0', fontSize: 22 }}>9.99%</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Tasa referencial con hipoteca</p>
            <div className="app-chart" style={{ height: 120 }}>
              <span style={{ height: '40%' }} />
              <span style={{ height: '55%' }} />
              <span style={{ height: '48%' }} />
              <span style={{ height: '72%' }} />
              <span style={{ height: '90%' }} />
            </div>
            <Link to="/credito" className="btn btn-lime" style={{ width: '100%' }}>
              Simular
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="phones">
      <div className="phone phone-back" aria-hidden="true">
        <div className="phone-screen">
          <div className="app-qr">
            <strong style={{ fontSize: 12 }}>Presupuesto</strong>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                background:
                  'conic-gradient(#8f2aa0 0 40%, #c9e412 40% 70%, #3a4ec4 70% 100%)',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700 }}>$210.00 disponible</span>
          </div>
        </div>
      </div>
      <div className="phone phone-front" aria-hidden="true">
        <ScreenHome />
      </div>
    </div>
  )
}

function ScreenHome() {
  return (
    <div className="phone-screen">
      <div className="app-status">
        <span>9:41</span>
        <span>5G ●</span>
      </div>
      <div className="app-head">
        <small>Hola,</small>
        <strong>Bienvenido a Mego</strong>
      </div>
      <div className="app-balance">
        <span>Saldo disponible</span>
        <b>$210.00</b>
      </div>
      <div className="app-cats">
        <div className="cat">
          <i style={{ background: '#3a4ec4' }}>🚌</i>
          Transporte
        </div>
        <div className="cat">
          <i style={{ background: '#e4572e' }}>🍔</i>
          Comida
        </div>
        <div className="cat">
          <i style={{ background: '#8f2aa0' }}>🏠</i>
          Hogar
        </div>
        <div className="cat">
          <i style={{ background: '#2a9d8f' }}>🎮</i>
          Ocio
        </div>
      </div>
      <div className="app-chart">
        <span style={{ height: '45%' }} />
        <span style={{ height: '70%' }} />
        <span style={{ height: '38%' }} />
        <span style={{ height: '86%' }} />
        <span style={{ height: '55%' }} />
        <span style={{ height: '64%' }} />
      </div>
      <div className="app-pay">
        <button className="cobrar" type="button">
          Cobrar
        </button>
        <button className="pagar" type="button">
          Pagar
        </button>
      </div>
    </div>
  )
}
