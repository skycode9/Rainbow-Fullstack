import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Lenis from "lenis";
import Home from "./pages/Home";
import LoadingAnimation from "./components/LoadingAnimation";

// Lazy load admin pages - only loaded when needed
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Films = lazy(() => import("./pages/admin/Films"));
const FilmForm = lazy(() => import("./pages/admin/FilmFormNew"));
const Team = lazy(() => import("./pages/admin/Team"));
const TeamForm = lazy(() => import("./pages/admin/TeamFormNew"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const ClientForm = lazy(() => import("./pages/admin/ClientFormNew"));
const Contacts = lazy(() => import("./pages/admin/Contacts"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Subscribers = lazy(() => import("./pages/admin/Subscribers"));
const Showcase = lazy(() => import("./pages/admin/Showcase"));
const ShowcaseForm = lazy(() => import("./pages/admin/ShowcaseForm"));

// Admin loading fallback
const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

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
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/admin/films"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Films />
            </Suspense>
          }
        />
        <Route
          path="/admin/films/create"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <FilmForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/films/edit/:id"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <FilmForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/team"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Team />
            </Suspense>
          }
        />
        <Route
          path="/admin/team/create"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <TeamForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/team/edit/:id"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <TeamForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Clients />
            </Suspense>
          }
        />
        <Route
          path="/admin/clients/create"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ClientForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/clients/edit/:id"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ClientForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Contacts />
            </Suspense>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="/admin/subscribers"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Subscribers />
            </Suspense>
          }
        />
        <Route
          path="/admin/showcase"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Showcase />
            </Suspense>
          }
        />
        <Route
          path="/admin/showcase/create"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ShowcaseForm />
            </Suspense>
          }
        />
        <Route
          path="/admin/showcase/edit/:id"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ShowcaseForm />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
