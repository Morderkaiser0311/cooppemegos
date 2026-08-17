import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroSlides } from '../data'

export function Hero() {
  const [index, setIndex] = useState(0)
  const slide = heroSlides[index]

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length)
    }, 10000)
    return () => window.clearInterval(id)
  }, [index])

  return (
    <section className="hero">
      <img className="hero-bg" src="/img/slider-bg.png" alt="" />
      <div className="hero-inner">
        <div className="hero-copy" key={slide.id}>
          <p className="hero-kicker">{slide.kicker}</p>
          <h1>
            <span className="hero-line">{slide.line1}</span>
            <span className="hero-line">
              {slide.line2 ? `${slide.line2} ` : null}
              <em>{slide.highlight}</em>
            </span>
          </h1>
          {'subtitle' in slide && slide.subtitle ? <p className="hero-sub">{slide.subtitle}</p> : null}
          <Link className="btn btn-lime" to={slide.to}>
            {slide.cta}
          </Link>
        </div>
        <div className="hero-visual" key={`${slide.id}-art`}>
          {slide.visual === 'phones' ? (
            <>
              <img className="hero-hex" src="/img/hex.png" alt="" />
              <img className="hero-phones" src="/img/phones.png" alt="" />
            </>
          ) : null}
          {slide.visual === 'pay' ? <img className="hero-art" src="/img/slider-2.png" alt="" /> : null}
          {slide.visual === 'credit' ? <img className="hero-art hero-art-credit" src="/img/verde.png" alt="" /> : null}
        </div>
      </div>
      <div className="megobullets">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            className={i === index ? 'sr7-bullet selected' : 'sr7-bullet'}
            type="button"
            aria-label={`Ir al slide ${item.kicker}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
