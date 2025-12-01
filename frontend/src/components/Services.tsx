import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Edit3, Palette, Music, Monitor, Megaphone } from 'lucide-react'

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const services = [
    {
      icon: Camera,
      title: 'Cinematography',
      description: 'Professional filming with state-of-the-art equipment and creative vision.',
      features: ['4K/8K Production', 'Drone Cinematography', 'Multi-Camera Setup']
    },
    {
      icon: Edit3,
      title: 'Post-Production',
      description: 'Expert editing, color grading, and visual effects to bring your story to life.',
      features: ['Advanced Editing', 'Color Grading', 'Visual Effects']
    },
    {
      icon: Palette,
      title: 'Creative Direction',
      description: 'Conceptual development and artistic guidance for your project.',
      features: ['Concept Development', 'Storyboarding', 'Art Direction']
    },
    {
      icon: Music,
      title: 'Audio Production',
      description: 'Professional sound design, mixing, and original music composition.',
      features: ['Sound Design', 'Audio Mixing', 'Original Scores']
    },
    {
      icon: Monitor,
      title: 'Live Streaming',
      description: 'High-quality live event coverage and streaming solutions.',
      features: ['Multi-Platform Streaming', 'Live Production', 'Event Coverage']
    },
    {
      icon: Megaphone,
      title: 'Brand Content',
      description: 'Commercial and promotional content that elevates your brand.',
      features: ['Commercial Videos', 'Brand Stories', 'Social Content']
    }
  ]

  return (
    <section id="services" className="py-20 bg-black" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Our</span>{' '}
            <span className="text-white">Services</span>
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From pre-production to final delivery, we offer comprehensive film and video 
            production services tailored to your unique vision and requirements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-white transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-rainbow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      className="flex items-center text-sm text-gray-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Learn More Button */}
                <motion.button
                  className="mt-6 text-white font-semibold hover:text-gray-300 transition-colors duration-300 group-hover:underline"
                  whileHover={{ x: 5 }}
                >
                  Learn More →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to bring your vision to life?
          </h3>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-semibold rounded-full hover:from-gray-200 hover:to-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
