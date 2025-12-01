import { motion } from 'framer-motion'
import { memo } from 'react'

function LoadingAnimation() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Rainbow loading line */}
      <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-rainbow-gradient"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </div>

      {/* Logo animation */}
      <div className="text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          RAINBOW
        </motion.h1>
        <motion.div
          className="w-32 h-1 bg-rainbow-gradient mx-auto mb-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.p
          className="text-2xl md:text-3xl font-light text-white tracking-widest"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          FILMS
        </motion.p>
      </div>

      {/* Simplified background gradient */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-500/30 to-transparent rounded-full blur-3xl" />
      </div>
    </motion.div>
  )
}

export default memo(LoadingAnimation)
