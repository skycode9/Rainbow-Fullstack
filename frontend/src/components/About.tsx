import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, memo } from "react";

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -50px 0px",
  });

  return (
    <section id="about" className="py-20 bg-black" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">About</span>{" "}
            <span className="text-white">Us</span>
          </h2>
          <motion.div
            className="relative w-32 h-0.5 mx-auto mb-8 overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <div className="absolute inset-0 bg-rainbow-gradient" />
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 lg:mb-8">
              Crafting Visual Stories That Inspire
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8 lg:mb-12">
              <div className="text-left">
                <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
                  At Rainbow Films, we believe every story deserves to be told
                  with passion, precision, and artistic excellence. Our team of
                  visionary creators combines cutting-edge technology with
                  timeless storytelling techniques to produce content that
                  resonates with audiences worldwide.
                </p>
              </div>
              <div className="text-left">
                <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
                  From concept to final cut, we handle every aspect of
                  production with meticulous attention to detail, ensuring that
                  your vision comes to life in the most compelling way possible.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 lg:mb-12">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                  150+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  Projects
                </div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">
                  15+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  Years
                </div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-pink-400 mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  Awards
                </div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  Satisfaction
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
