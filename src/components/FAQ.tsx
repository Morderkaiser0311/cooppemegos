import { Link } from 'react-router-dom'
import { faqTopics } from '../data'

export function FAQ() {
  return (
    <section className="faq-band">
      <div className="container">
        <h2 className="faq-heading">
          <Link to="/faq">Preguntas frecuentes - FAQ</Link>
        </h2>
        <div className="faq-grid">
          {faqTopics.map((topic) => (
            <Link key={topic.to} className="faq-card" to={topic.to}>
              <span className="faq-prefix">{topic.prefix}</span>
              <strong>{topic.title}</strong>
              <span className="faq-more">Ver más &gt;</span>
            </Link>
          ))}
        </div>
        <p className="faq-more-wrap">
          <Link className="btn btn-outline-light" to="/faq">
            Más ayuda y otros temas
          </Link>
        </p>
      </div>
      <div className="faq-tilt" aria-hidden="true" />
    </section>
  )
}
