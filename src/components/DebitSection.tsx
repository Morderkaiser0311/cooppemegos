import { Link } from 'react-router-dom'

export function DebitSection() {
  return (
    <section className="section debit-section">
      <div className="container debit">
        <div className="debit-visual">
          <Link to="/tarjeta-debito">
            <img src="/img/cards.png" alt="Tarjetas de débito Mastercard Mego" />
          </Link>
        </div>
        <div>
          <p className="kicker">Tarjeta de débito</p>
          <h2>
            Olvídate
            <br />
            del Efectivo
          </h2>
          <p>
            Con tu tarjeta de débito Mastercard Mego paga en más de 5 000 000 locales a
            nivel mundial y olvídate de cargar efectivo. Úsala para tus compras en línea,
            suscripciones y mucho más.
          </p>
          <Link className="btn btn-magenta" to="/tarjeta-debito">
            <Arrow />
            Solicítala ahora
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Arrow() {
  return (
    <svg aria-hidden="true" className="btn-arrow" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
      />
    </svg>
  )
}
