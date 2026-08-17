type LogoProps = {
  light?: boolean
}

export function Logo({ light }: LogoProps) {
  return (
    <img
      className={light ? 'logo-img logo-img-light' : 'logo-img'}
      src={light ? '/img/logo-white.png' : '/img/logo.png'}
      alt="Logo, dice: Mego Cooperativa de ahorro y crédito"
    />
  )
}
