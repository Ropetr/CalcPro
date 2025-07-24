import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Calculators from '@/components/Calculators'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Calculators />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}