import { Hero } from '../components/Hero'
import { ActionCards } from '../components/ActionCards'
import { DebitSection } from '../components/DebitSection'
import { Channels } from '../components/Channels'
import { News } from '../components/News'
import { FAQ } from '../components/FAQ'
import { Emergency } from '../components/Emergency'
import { Cosede } from '../components/Cosede'

export function Home() {
  return (
    <>
      <Hero />
      <ActionCards />
      <DebitSection />
      <Channels />
      <News />
      <FAQ />
      <Emergency />
      <Cosede />
    </>
  )
}
