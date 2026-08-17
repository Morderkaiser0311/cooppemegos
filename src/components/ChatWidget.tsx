import { useState } from 'react'

export function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bee-wrap">
      {open ? (
        <div className="chat-panel">
          <header>
            Asistente Mego
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat">
              ✕
            </button>
          </header>
          <div className="msgs">
            <p>
              <strong>¡Bienvenido!</strong> ¿Cómo podemos ayudarte?
            </p>
          </div>
        </div>
      ) : null}
      <button id="genesys-messenger" className="widget-btn" type="button" onClick={() => setOpen((v) => !v)}>
        <img src="/img/bee.png" alt="Abrir chat" />
      </button>
    </div>
  )
}
