import { useMemo, useState } from 'react'
import { agencies } from '../data'
import { Icon } from '../components/Icon'

export function Agencias() {
  const [query, setQuery] = useState('')
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return agencies
    return agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker" style={{ color: 'var(--lime)' }}>
            Institución
          </p>
          <h1>Red de agencias</h1>
          <p>
            Contamos con 23 oficinas en Loja, Azuay, Cotopaxi, Zamora Chinchipe, El Oro,
            Morona Santiago, Pichincha y Santo Domingo de los Tsáchilas.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <label className="form" style={{ maxWidth: 420, marginBottom: 24 }}>
            Buscar agencia
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Loja, Cuenca, Quito…"
            />
          </label>
          <div className="page-grid">
            {list.map((agency) => (
              <article key={agency.name} className="agency-card">
                <span className="icon-bubble" style={{ marginBottom: 10 }}>
                  <Icon name="pin" />
                </span>
                <h3>{agency.name}</h3>
                <p>{agency.address}</p>
                <p>{agency.city}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
