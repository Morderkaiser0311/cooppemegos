import { useState } from 'react'
import { Link } from 'react-router-dom'
import { menuCards, menuTopLinks } from '../data'

type MenuDrawerProps = {
  open: boolean
  onClose: () => void
}

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const [active, setActive] = useState<string | null>(null)
  const card = menuCards.find((item) => item.id === active)

  if (!open) return null

  return (
    <>
      <div className="mlr-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="mlr-panel" role="dialog" aria-modal="true" aria-label="Menú">
        <div className="mlr-panel-header">
          <div className="mlr-header-top">
            <button className="mlr-close-btn" type="button" aria-label="Cerrar menú" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <span className="mlr-menu-title">Menú</span>
          </div>
          <nav className="mlr-header-nav" aria-label="Links de navegación">
            <ul className="mlr-top-links">
              {menuTopLinks.map((link) => (
                <li key={link.label}>
                  <Link className="mlr-top-link" to={link.to} onClick={onClose}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mlr-panel-body">
          <ul className="mlr-cards-grid">
            {menuCards.map((item) =>
              item.to ? (
                <li key={item.id}>
                  <Link className="mlr-card" to={item.to} onClick={onClose}>
                    <span className="mlr-card-icon">
                      <MenuIcon name={item.icon} />
                    </span>
                    <span className="mlr-card-label">{item.label}</span>
                  </Link>
                </li>
              ) : (
                <li key={item.id}>
                  <button
                    type="button"
                    className={active === item.id ? 'mlr-card is-active' : 'mlr-card'}
                    aria-expanded={active === item.id}
                    onClick={() => setActive(active === item.id ? null : item.id)}
                  >
                    <span className="mlr-card-icon">
                      <MenuIcon name={item.icon} />
                    </span>
                    <span className="mlr-card-label">{item.label}</span>
                  </button>
                </li>
              ),
            )}
          </ul>

          {card && card.categories.length > 0 ? (
            <div className="mlr-submenu-panel">
              {card.categories.map((cat) => (
                <div key={cat.title} className="mlr-submenu-category">
                  <h3>{cat.title}</h3>
                  <ul>
                    {cat.links.map((link) => (
                      <li key={`${cat.title}-${link.label}`}>
                        <Link to={link.to} onClick={onClose}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  )
}

function MenuIcon({ name }: { name: string }) {
  if (name === 'productos') {
    return (
      <svg viewBox="0 0 40 40" fill="currentColor" width="40" height="40" aria-hidden="true">
        <circle cx="8" cy="8" r="3" />
        <circle cx="20" cy="8" r="3" />
        <circle cx="32" cy="8" r="3" />
        <circle cx="8" cy="20" r="3" />
        <circle cx="20" cy="20" r="3" />
        <circle cx="32" cy="20" r="3" />
        <circle cx="8" cy="32" r="3" />
        <circle cx="20" cy="32" r="3" />
        <circle cx="32" cy="32" r="3" />
      </svg>
    )
  }
  if (name === 'canales') {
    return (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="40" height="40" aria-hidden="true">
        <rect x="4" y="4" width="22" height="18" rx="2" />
        <path d="M30 14h6v18a2 2 0 0 1-2 2H14" />
        <path d="M16 28l-4 4m4 0l-4-4" />
      </svg>
    )
  }
  if (name === 'beneficios') {
    return (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="40" height="40" aria-hidden="true">
        <rect x="6" y="2" width="28" height="36" rx="2" />
        <path d="M20 28l-5.4-5.4a3.8 3.8 0 0 1 5.4-5.4 3.8 3.8 0 0 1 5.4 5.4L20 28z" />
        <line x1="12" y1="8" x2="22" y2="8" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="40" height="40" aria-hidden="true">
      <path d="M6 36h28" />
      <path d="M8 36V12l12-8 12 8v24" />
      <line x1="14" y1="16" x2="14" y2="20" />
      <line x1="20" y1="16" x2="20" y2="20" />
      <line x1="26" y1="16" x2="26" y2="20" />
      <line x1="14" y1="24" x2="14" y2="28" />
      <line x1="20" y1="24" x2="20" y2="28" />
      <line x1="26" y1="24" x2="26" y2="28" />
    </svg>
  )
}
