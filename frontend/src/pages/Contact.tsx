import Navigation from '../components/Navigation'
import ContactComponent from '../components/Contact'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navigation />
      <div className="pt-20">
        <ContactComponent />
      </div>
      <Footer />
    </main>
  )
}
