import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { faqs } from '../data'

export function FaqPage() {
  const location = useLocation()
  const hash = location.hash.replace('#', '')
  const [open, setOpen] = useState<number | null>(0)

  const items = useMemo(() => {
    if (!hash) return faqs
    const filtered = faqs.filter((item) => item.id === hash)
    return filtered.length ? filtered : faqs
  }, [hash])

  useEffect(() => {
    setOpen(0)
  }, [hash])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker" style={{ color: 'var(--lime)' }}>
            Ayuda
          </p>
          <h1>Preguntas frecuentes</h1>
          <p>Respuestas claras sobre canales, productos y operaciones del día a día.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          {items.map((item, index) => (
            <article key={`${item.q}-${index}`} className="faq-item">
              <button type="button" onClick={() => setOpen(open === index ? null : index)}>
                {item.q}
                <span>{open === index ? '−' : '+'}</span>
              </button>
              {open === index ? <p>{item.a}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
