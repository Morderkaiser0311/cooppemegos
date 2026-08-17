import { Link } from 'react-router-dom'

const cards = [
  {
    to: '/contacto',
    title: 'Necesito ayuda de un asesor',
    text: 'Estamos para ayudarte, escríbenos y resolveremos tus dudas.',
    link: 'Contactar >',
    icon: 'asesor' as const,
  },
  {
    to: '/credito',
    title: 'Necesito un credito',
    text: 'Tenemos el crédito ideal para tus gastos o para tu negocio',
    link: 'Más información >',
    icon: 'credito' as const,
  },
  {
    to: '/inversiones',
    title: 'Quiero invertir mi dinero',
    text: 'Haz crecer tu dinero con una póliza o un ahorro propósito.',
    link: 'Más información >',
    icon: 'invertir' as const,
  },
]

export function ActionCards() {
  return (
    <section className="section section-actions">
      <div className="container cards-3">
        {cards.map((card) => (
          <div key={card.title} className="action-card">
            <span className="icon-bubble">
              <ActionIcon name={card.icon} />
            </span>
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Link className="action-link" to={card.to}>
                {card.link}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActionIcon({ name }: { name: 'asesor' | 'credito' | 'invertir' }) {
  if (name === 'asesor') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#bd2cf9" aria-hidden="true">
        <path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" />
      </svg>
    )
  }
  if (name === 'credito') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#bd2cf9" aria-hidden="true">
        <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#5C4AE0" aria-hidden="true">
      <path d="M127.33-240 80-287.33l293.33-293.34L538-416l230-229.33H648.67V-712H880v231.33h-66v-116.66L537.33-320.67 372.67-485.33 127.33-240Z" />
    </svg>
  )
}
