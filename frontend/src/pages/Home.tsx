import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Films from "../components/Portfolio"; // Renamed from Portfolio to Films
import About from "../components/About";
import ShowcaseSlider from "../components/ShowcaseSlider";
import Team from "../components/Team";
// import Services from '../components/Services' // Commented out as requested
import Contact from "../components/Contact";
import Clients from "../components/Clients";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navigation />
      <Hero />
      <Films />
      <About />
      <ShowcaseSlider />
      <Team />
      <Clients />
      <Contact />
      <Footer />
    </main>
  );
}
