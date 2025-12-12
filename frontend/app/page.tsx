import Hero from '@/components/Hero'
import Products from '@/components/Products'
import About from '@/components/About'
import Services from '@/components/Services'
import Contact from '@/components/Contact'
import Features from '@/components/Features'

export default function Home() {
  return (
    <div className="pt-20">
      <Hero />
      <Features />
      <Products />
      <About />
      <Services />
      <Contact />
    </div>
  )
}

