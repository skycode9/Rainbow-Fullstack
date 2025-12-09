import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import {
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
} from "lucide-react";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "home" || sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      // Use scrollIntoView instead of offsetTop to avoid forced reflows
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Adjust for fixed navbar
      setTimeout(() => {
        window.scrollBy({ top: -80, behavior: "smooth" });
      }, 0);
    }
  };

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        setStatus("error");
        setStatusMessage("Email is required");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus("error");
        setStatusMessage("Enter a valid email");
        return;
      }

      setStatus("submitting");
      setStatusMessage("");

      try {
        const { getApiUrl } = await import("../utils/config");
        const API_URL = getApiUrl();
        const response = await fetch(`${API_URL}/subscribers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setStatusMessage(data.message || "Subscribed successfully!");
          setEmail("");
        } else {
          setStatus("error");
          setStatusMessage(
            data.message || "Failed to subscribe. Please try again."
          );
        }
      } catch (error) {
        setStatus("error");
        setStatusMessage("Network error. Please try again.");
      }
    },
    [email]
  );

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/rainbowfilmsofficial/",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/rainbowfilmsofficial/posts/?feedView=all",
      label: "LinkedIn",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@RainbowFilmsOfficial",
      label: "YouTube",
    },
  ];

  return (
    <footer
      className="bg-gradient-to-t from-black to-gray-900 text-white"
      ref={ref}
    >
      {/* Rainbow line */}
      <div className="w-full h-1 bg-rainbow-gradient" />

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection("home")}
            >
              <img
                src="/logo_512x512.png"
                alt="Rainbow Films"
                className="h-24 w-auto"
              />
            </motion.div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Crafting cinematic excellence through innovative storytelling,
              cutting-edge technology, and boundless creativity.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={16} className="text-white" />
                <span className="text-sm">hello@rainbowfilms.in</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={16} className="text-white" />
                <span className="text-sm">Ahmedabad, Gujarat</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Stay Connected
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Subscribe to our newsletter for the latest updates.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className={`flex-1 px-3 py-2 bg-gray-800 border rounded text-sm text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                      status === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-700 focus:border-white"
                    }`}
                  />
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {status === "submitting" ? "Subscribing..." : "Subscribe"}
                  </motion.button>
                </div>
                {status !== "idle" && statusMessage && (
                  <p
                    className={`text-xs ${
                      status === "success" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </form>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>
                © {currentYear} RAINBOW Films Production House. Made with
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart size={16} className="text-red-500 fill-current" />
              </motion.div>
              <span>in Anand.</span>
            </div>

            <div className="flex gap-6 text-gray-400 text-sm">
              <motion.a
                href="#"
                className="hover:text-white transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-white transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-white transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
