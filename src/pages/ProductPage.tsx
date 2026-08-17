import { Link, useParams } from 'react-router-dom'
import { productPages } from '../data'

export function ProductPage() {
  const { slug = '' } = useParams()
  const page = productPages[slug]

  if (!page) {
    return (
      <section className="section">
        <div className="container">
          <h1>No encontramos esta página</h1>
          <p>El contenido que buscas no está disponible.</p>
          <Link className="btn btn-purple" to="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker" style={{ color: 'var(--lime)' }}>
            {page.kicker}
          </p>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ul className="points">
            {page.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {page.cta ? (
            <Link className="btn btn-lime" to={page.cta.to}>
              {page.cta.label}
            </Link>
          ) : null}
        </div>
      </section>
    </>
  )
}
