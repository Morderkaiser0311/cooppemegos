import { useState, type FormEvent } from 'react'

type LoginProps = {
  title: string
  lead: string
}

export function Login({ title, lead }: LoginProps) {
  const [message, setMessage] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      'Este es un portal de demostración. En producción, el ingreso se realiza con las credenciales de tu canal electrónico.',
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="login-card">
          <h2>{title}</h2>
          <p>{lead}</p>
          <form className="form" onSubmit={onSubmit}>
            <label>
              Usuario
              <input name="user" required autoComplete="username" />
            </label>
            <label>
              Clave
              <input name="password" type="password" required autoComplete="current-password" />
            </label>
            <button className="btn btn-blue" type="submit">
              Ingresar
            </button>
          </form>
          {message ? <p className="notice">{message}</p> : null}
        </div>
      </div>
    </section>
  )
}
