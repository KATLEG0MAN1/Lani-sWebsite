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
          src="https://images.unsplash.com/photo-1676495906154-96415c612630"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative h-full flex items-center justify-center text-center"
      >
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Luxury
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Exclusive collection of premium fashion and accessories
          </p>
        </div>
      </motion.div>
    </div>
  );
}
