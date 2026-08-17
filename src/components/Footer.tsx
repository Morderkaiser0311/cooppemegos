import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bar">
        <div className="footer-bar-inner">
          <Link to="/" className="footer-logo" aria-label="Inicio Mego">
            <Logo light />
          </Link>
          <nav className="footer-bar-nav">
            <Link to="/ahorros">Productos</Link>
            <Link to="/megomovil">Canales electrónicos</Link>
            <Link to="/nosotros">Institución</Link>
            <Link to="/ser-socio">Beneficios</Link>
          </nav>
          <div className="footer-social">
            <a href="https://www.facebook.com/Mego.ec" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="https://www.instagram.com/mego.ec/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="https://www.tiktok.com/@mego.ec" target="_blank" rel="noreferrer" aria-label="Tiktok">
              <Tiktok />
            </a>
          </div>
          <button
            className="footer-top"
            type="button"
            aria-label="Volver arriba"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg viewBox="0 0 448 512" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="container footer-cols">
        <div>
          <p>
            <strong>Contáctanos</strong>
          </p>
          <Link to="/contacto">Contacta un asesor</Link>
          <Link to="/contacto">Directorio telefónico</Link>
          <p>
            <strong>Seguridad</strong>
          </p>
          <Link to="/transparencia">Consejos de seguridad</Link>
          <Link to="/transparencia">Normas de seguridad</Link>
          <Link to="/transparencia">Protección de datos personales</Link>
        </div>
        <div>
          <p>
            <strong>Institución</strong>
          </p>
          <a href="https://coopmego.hiringroom.com/jobs" target="_blank" rel="noreferrer">
            Trabaja con nosotros
          </a>
          <Link to="/nosotros">Responsabilidad social</Link>
          <Link to="/agencias">Red de agencias</Link>
          <Link to="/agencias">Red de cajeros automáticos</Link>
          <Link to="/agencias">Horarios de atención</Link>
          <Link to="/transparencia">Transparencia</Link>
          <Link to="/gobierno">Buen Gobierno</Link>
        </div>
        <div>
          <p>
            <strong>Información</strong>
          </p>
          <Link to="/transparencia">Remates</Link>
          <Link to="/transparencia">Subasta Pública</Link>
          <Link to="/megoonline">Facturación</Link>
          <Link to="/contacto">Reclamos</Link>
          <Link to="/megoonline">Validador de documentos</Link>
          <Link to="/faq">Tutoriales e instructivos</Link>
          <Link to="/transparencia">COSEDE</Link>
        </div>
      </div>

      <div className="footer-legal">
        <p>© 2026 Cooperativa de Ahorro y Crédito Vicentina “Manuel Esteban Godoy Ortega” Ltda.</p>
        <p>
          Matriz Loja: Bolívar 207-40 entre Azuay y Miguel Riofrío | PBX: (07) 3 705-840 | Email:
          info@coopmego.fin.ec | Ecuador
        </p>
      </div>
    </footer>
  )
}

function Facebook() {
  return (
    <svg viewBox="0 0 512 512" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
      />
    </svg>
  )
}

function Instagram() {
  return (
    <svg viewBox="0 0 448 512" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
      />
    </svg>
  )
}

function Tiktok() {
  return (
    <svg viewBox="0 0 448 512" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"
      />
    </svg>
  )
}
