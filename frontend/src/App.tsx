import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Lenis from "lenis";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Films from "./pages/admin/Films";
import FilmForm from "./pages/admin/FilmFormNew";
import Team from "./pages/admin/Team";
import TeamForm from "./pages/admin/TeamFormNew";
import Clients from "./pages/admin/Clients";
import ClientForm from "./pages/admin/ClientFormNew";
import Contacts from "./pages/admin/Contacts";
import Settings from "./pages/admin/Settings";
import Subscribers from "./pages/admin/Subscribers";
import Showcase from "./pages/admin/Showcase";
import ShowcaseForm from "./pages/admin/ShowcaseForm";
import LoadingAnimation from "./components/LoadingAnimation";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Initialize Lenis for smooth scrolling - Optimized settings (only for non-admin pages)
    if (!isAdminRoute) {
      const lenis = new Lenis({
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
      });

      // Optimized RAF loop with throttling
      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }
  }, [isAdminRoute]);

  useEffect(() => {
    // Loading animation - reduced time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Back to top visibility - throttled (only for non-admin pages)
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking && !isAdminRoute) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.pageYOffset > 300);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAdminRoute]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      <AnimatePresence>
        {isLoading && !isAdminRoute && <LoadingAnimation />}
      </AnimatePresence>

      <Routes>
        <Route
          path="/"
          element={
            !isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Home />
                {showBackToTop && (
                  <motion.button
                    className="fixed bottom-8 right-8 z-50 w-12 h-12 border-2 hover:opacity-80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowUp size={20} className="group-hover:animate-bounce" />
                  </motion.button>
                )}
              </motion.div>
            ) : null
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/films" element={<Films />} />
        <Route path="/admin/films/create" element={<FilmForm />} />
        <Route path="/admin/films/edit/:id" element={<FilmForm />} />
        <Route path="/admin/team" element={<Team />} />
        <Route path="/admin/team/create" element={<TeamForm />} />
        <Route path="/admin/team/edit/:id" element={<TeamForm />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/clients/create" element={<ClientForm />} />
        <Route path="/admin/clients/edit/:id" element={<ClientForm />} />
        <Route path="/admin/contacts" element={<Contacts />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/subscribers" element={<Subscribers />} />
        <Route path="/admin/showcase" element={<Showcase />} />
        <Route path="/admin/showcase/create" element={<ShowcaseForm />} />
        <Route path="/admin/showcase/edit/:id" element={<ShowcaseForm />} />
      </Routes>
    </div>
  );
}

export default App;
