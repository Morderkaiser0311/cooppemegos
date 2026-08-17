import { Link } from 'react-router-dom'
import { news } from '../data'

export function News() {
  const [featured, second, ...rest] = news

  return (
    <section className="section news-section">
      <div className="container news-layout">
        <article className="news-featured">
          <Link to={featured.to} className="news-thumb">
            <img src={featured.image} alt="" />
          </Link>
          <div className="news-badge">{featured.tag}</div>
          {featured.author ? (
            <img className="news-avatar" src="https://mego.com.ec/wp-content/uploads/2026/06/Foto-Wordpress-150x150.png" alt={featured.author} />
          ) : null}
          <div className="news-body">
            <h3>
              <Link to={featured.to}>{featured.title}</Link>
            </h3>
            <p>{featured.text}</p>
            <span className="news-date">{featured.date}</span>
          </div>
        </article>
        <div className="news-side">
          <article className="news-card-mid">
            <Link to={second.to} className="news-thumb">
              <img src={second.image} alt="" />
            </Link>
            <div className="news-badge">{second.tag}</div>
            <div className="news-body">
              <h3>
                <Link to={second.to}>{second.title}</Link>
              </h3>
              <span className="news-date">{second.date}</span>
            </div>
          </article>
          <div className="news-row">
            {rest.map((item) => (
              <article key={item.to} className="news-mini">
                <Link to={item.to} className="news-thumb">
                  <img src={item.image} alt="" />
                </Link>
                <div>
                  <h5>
                    <Link to={item.to}>{item.title}</Link>
                  </h5>
                  <span className="news-date">{item.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <p className="news-all">
        <Link className="btn btn-outline" to="/noticias/escuela-lideres">
          Ver todas las noticias de nuestro blog
        </Link>
      </p>
    </section>
  )
}
