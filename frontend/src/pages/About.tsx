import Navigation from '../components/Navigation'
import AboutComponent from '../components/About'
import Footer from '../components/Footer'

export default function About() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navigation />
      <div className="pt-20">
        <AboutComponent />
      </div>
      <Footer />
    </main>
  )
}
