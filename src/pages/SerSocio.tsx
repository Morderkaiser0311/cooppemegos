import { useState, type FormEvent } from 'react'

export function SerSocio() {
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="kicker" style={{ color: 'var(--lime)' }}>
            Afiliación
          </p>
          <h1>Quiero ser socio</h1>
          <p>
            Completa tus datos y un asesor Mego te contactará para continuar el proceso de
            afiliación en la agencia más cercana.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {sent ? (
            <p className="notice">
              Recibimos tu solicitud. Te contactaremos en horario de atención para
              coordinar tu afiliación.
            </p>
          ) : (
            <form className="form" onSubmit={onSubmit}>
              <label>
                Nombres y apellidos
                <input name="name" required />
              </label>
              <label>
                Cédula
                <input name="id" required minLength={10} maxLength={13} />
              </label>
              <label>
                Correo
                <input name="email" type="email" required />
              </label>
              <label>
                Celular
                <input name="phone" required />
              </label>
              <label>
                Ciudad
                <input name="city" required />
              </label>
              <label>
                Me interesa
                <select name="interest" defaultValue="ahorros">
                  <option value="ahorros">Ahorros</option>
                  <option value="credito">Crédito</option>
                  <option value="inversiones">Inversiones</option>
                  <option value="empresas">MegoEmpresas</option>
                </select>
              </label>
              <button className="btn btn-lime" type="submit">
                Enviar solicitud
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
