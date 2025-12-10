import { lazy, Suspense } from "react";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Films from "../components/Portfolio"; // Renamed from Portfolio to Films
import About from "../components/About";

// Lazy load below-the-fold components
const ShowcaseSlider = lazy(() => import("../components/ShowcaseSlider"));
const Team = lazy(() => import("../components/Team"));
const Clients = lazy(() => import("../components/Clients"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

// Minimal loading placeholder
const SectionFallback = () => <div className="min-h-[200px] bg-black" />;

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navigation />
      <Hero />
      <Films />
      <About />
      <Suspense fallback={<SectionFallback />}>
        <ShowcaseSlider />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Team />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Clients />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Contact />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </main>
  );
}
