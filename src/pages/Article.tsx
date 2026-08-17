import { useParams } from 'react-router-dom'
import { news } from '../data'

export function Article() {
  const { slug } = useParams()
  const item = news.find((n) => n.to.endsWith(`/${slug}`))

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker" style={{ color: 'var(--lime)' }}>
            {item?.tag ?? 'Noticia'}
          </p>
          <h1>{item?.title ?? 'Artículo'}</h1>
          <p>{item?.date}</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <p>{item?.text}</p>
          <p>
            Esta es una nota informativa de la cooperativa. Para inscripciones o más
            detalles, acércate a tu agencia o escribe a un asesor desde Contacto.
          </p>
        </div>
      </section>
    </>
  )
}
