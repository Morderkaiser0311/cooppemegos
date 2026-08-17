import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { MenuDrawer } from './MenuDrawer'
import { ChatWidget } from './ChatWidget'
import { CookieWidget } from './CookieWidget'

export function Layout() {
  const [menu, setMenu] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenu(false)
  }, [location.pathname, location.hash])

  return (
    <>
      <Header onMenu={() => setMenu(true)} />
      <MenuDrawer open={menu} onClose={() => setMenu(false)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieWidget />
      <ChatWidget />
    </>
  )
}
