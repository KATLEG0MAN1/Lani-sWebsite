import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative h-full flex items-center justify-center text-center"
      >
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            CODEe
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            COME OUTSIDE DIRECTIVE ENTERTAINMENT
          </p>
        </div>
      </motion.div>
    </div>
  );
}