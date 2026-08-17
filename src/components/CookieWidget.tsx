import { useState } from 'react'

export function CookieWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="cookie-btn" type="button" aria-label="Modificar preferencias de cookies" onClick={() => setOpen((v) => !v)}>
        <img src="/img/cookie.svg" alt="" width={40} height={40} />
      </button>
      {open ? (
        <div className="cookie-panel">
          <strong>Respetamos tu privacidad</strong>
          <p>
            Las cookies nos ayudan a mejorar tu experiencia, ofrecer contenido personalizado y
            analizar el tráfico. Puedes aceptar o rechazar las cookies no esenciales.
          </p>
          <div className="cookie-actions">
            <button className="btn btn-outline" type="button" onClick={() => setOpen(false)}>
              Rechazar todo
            </button>
            <button className="btn btn-blue" type="button" onClick={() => setOpen(false)}>
              Aceptar todo
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
