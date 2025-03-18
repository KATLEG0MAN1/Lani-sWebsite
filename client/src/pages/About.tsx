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
        <h1 className="text-4xl font-bold mb-8">About Mr Freedo</h1>

        <div className="prose prose-lg">
          <p className="text-xl font-medium mb-6">
            Born on May 30th, 2000, Xolani Buyeye, known professionally as Freedo and Lani Colors,
            is a visionary artist who has been pushing the boundaries of musical expression since
            his early years.
          </p>

          <div className="my-8">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
              alt="Mr Freedo"
              className="rounded-lg w-full"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Artistic Vision</h2>
            <p>
              Mr Freedo prides himself in his innovative approach to music creation,
              particularly in his mastery of frequency engineering and sound design.
              His unique style combines experimental sounds with innovative rap flows,
              constantly pushing the boundaries of conventional genres.
            </p>

            <h2 className="text-2xl font-bold">Musical Journey</h2>
            <p>
              From his early days, Freedo has been dedicated to creating a new kind of rap,
              one that seamlessly blends experimental sounds with traditional elements.
              His work under the name Lani Colors showcases an endless variety of new
              and experimental sounds, reflecting his commitment to musical innovation.
            </p>

            <h2 className="text-2xl font-bold">Creative Philosophy</h2>
            <p>
              Known for being endless in his creativity, fearless in his artistic choices,
              detailed in his production, precise in his execution, and determined in his
              vision, Mr Freedo continues to demonstrate his vast ingenuity through each
              new release.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}