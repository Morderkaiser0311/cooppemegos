import { Link } from 'react-router-dom'
import { channels } from '../data'
import { Arrow } from './DebitSection'

export function Channels() {
  return (
    <section className="section channels">
      <div className="container">
        <h2 className="channels-title">
          <span className="channels-highlight">¡Más Simple! </span>
          Con nuestros canales electrónicos
        </h2>
        <div className="channels-grid">
          {channels.map((item) => (
            <article key={item.to} className="channel-card">
              <img src={item.logo} alt="" />
              {item.title ? (
                <p>
                  <strong>{item.title}</strong>
                </p>
              ) : (
                <p>
                  <strong>
                    <br />
                  </strong>
                </p>
              )}
              <p>{item.text}</p>
              <Link className="btn btn-magenta" to={item.to}>
                <Arrow />
                Mas información
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
