import { Link } from 'react-router-dom'

export function Cosede() {
  return (
    <section className="section cosede-section">
      <div className="container">
        <div className="cosede-banner">
          <img src="/img/cosede.png" alt="Tus depósitos están protegidos por COSEDE" />
          <Link className="cosede-hotspot" to="/transparencia">
            www.cosede.gob.ec
          </Link>
        </div>
      </div>
    </section>
  )
}
