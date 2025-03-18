import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">About GOLF le FLEUR*</h1>
        
        <div className="prose prose-lg">
          <p>
            GOLF le FLEUR* is a luxury fashion brand that represents the intersection
            of high-end design and contemporary street culture. Founded with a vision
            to create unique, quality pieces that stand the test of time.
          </p>
          
          <img
            src="https://images.unsplash.com/photo-1676495905801-9a27a0ccc977"
            alt="About Us"
            className="my-8 rounded-lg"
          />
          
          <p>
            Our commitment to quality and attention to detail is evident in every piece
            we create. We source the finest materials and work with skilled artisans
            to bring our vision to life.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Philosophy</h2>
          <p>
            We believe in creating more than just clothing - we're crafting experiences
            and emotions through design. Each collection tells a story, representing
            a perfect blend of luxury and self-expression.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
