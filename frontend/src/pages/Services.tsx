import Navigation from '../components/Navigation'
import ServicesComponent from '../components/Services'
import Footer from '../components/Footer'

export default function Services() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navigation />
      <div className="pt-20">
        <ServicesComponent />
      </div>
      <Footer />
    </main>
  )
}
