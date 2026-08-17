import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ProductPage } from './pages/ProductPage'
import { Agencias } from './pages/Agencias'
import { SerSocio } from './pages/SerSocio'
import { MegoEmpresas } from './pages/MegoEmpresas'
import { MegOnline } from './pages/MegOnline'
import { FaqPage } from './pages/FaqPage'
import { Article } from './pages/Article'

export default function App() {
  return (
    <Routes>
      <Route path="/megoempresas" element={<MegoEmpresas />} />
      <Route path="/megoonline" element={<MegOnline />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agencias" element={<Agencias />} />
        <Route path="/ser-socio" element={<SerSocio />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/noticias/:slug" element={<Article />} />
        <Route path="/:slug" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
