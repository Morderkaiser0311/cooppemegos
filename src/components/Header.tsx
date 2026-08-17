import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { searchIndex } from '../data'
import { Logo } from './Logo'

type HeaderProps = {
  onMenu: () => void
}

export function Header({ onMenu }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <header className={scrolled ? 'header scrolled' : 'header'}>
      <div className="header-inner header-desktop">
        <div className="header-left">
          <button className="menu-btn" type="button" onClick={onMenu} aria-label="Abrir menú">
            <svg className="mlr-hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
              <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
            </svg>
            <span>Menú</span>
          </button>
          <form
            className={searchOpen || query ? 'hfe-search open' : 'hfe-search'}
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              if (results[0]) navigate(results[0].to)
            }}
          >
            <input
              className="hfe-search-form__input"
              type="search"
              name="s"
              title="Buscar"
              placeholder=""
              value={query}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 180)}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 512 512" aria-hidden="true">
              <path fill="currentColor" d="M505 442.7 405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
            </svg>
            {searchOpen && results.length > 0 ? (
              <div className="search-drop">
                {results.map((item) => (
                  <Link key={item.to} to={item.to} onMouseDown={(e) => e.preventDefault()}>
                    {item.label}
                    <span>{item.hint}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </form>
        </div>
        <NavLink className="header-logo" to="/" aria-label="Inicio Mego">
          <Logo />
        </NavLink>
        <div className="header-right">
          <Link className="btn btn-outline" to="/ser-socio">
            Quiero ser socio
          </Link>
          <Link className="btn btn-purple" to="/megoempresas">
            Ingresa a MegoEmpresas
          </Link>
          <Link className="btn btn-blue" to="/megoonline">
            Ingresa a MegOnline
          </Link>
        </div>
      </div>

      <div className="header-inner header-mobile">
        <button className="menu-btn" type="button" onClick={onMenu} aria-label="Abrir menú">
          <svg className="mlr-hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
            <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
          </svg>
          <span>Menú</span>
        </button>
        <NavLink className="header-logo" to="/" aria-label="Inicio Mego">
          <Logo />
        </NavLink>
        <div className="header-mobile-actions">
          <Link className="btn btn-outline" to="/ser-socio">
            Quiero ser socio
          </Link>
          <Link className="btn btn-blue" to="/megoonline">
            Ingresa a MegOnline
          </Link>
          <Link className="btn btn-purple" to="/megoempresas">
            Ingresa a MegoEmpresas
          </Link>
        </div>
      </div>
    </header>
  )
}
