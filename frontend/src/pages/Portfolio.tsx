import Navigation from '../components/Navigation'
import PortfolioComponent from '../components/Portfolio'
import Footer from '../components/Footer'

export default function Portfolio() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navigation />
      <div className="pt-20">
        <PortfolioComponent />
      </div>
      <Footer />
    </main>
  )
}
