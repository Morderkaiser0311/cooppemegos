import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchIndex } from '../data'
import { Icon } from './Icon'

type SearchModalProps = {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return searchIndex
    return searchIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q),
    )
  }, [query])

  if (!open) return null

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="search-modal" role="dialog" aria-label="Buscar">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <strong>Buscar en Mego</strong>
          <button className="icon-btn" type="button" aria-label="Cerrar búsqueda" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="MegoMóvil, crédito, agencias…"
        />
        <div style={{ marginTop: 8 }}>
          {results.map((item) => (
            <Link key={item.to} className="search-hit" to={item.to} onClick={onClose}>
              {item.label}
              <span>{item.hint}</span>
            </Link>
          ))}
          {results.length === 0 ? <p>No encontramos resultados.</p> : null}
        </div>
      </div>
    </>
  )
}
