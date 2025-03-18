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
        <h1 className="text-4xl font-bold mb-8">About CODEe</h1>

        <div className="prose prose-lg">
          <p className="text-xl font-medium mb-6">
            COME OUTSIDE DIRECTIVE ENTERTAINMENT (CODEe) was founded by Xolani Buyeye, 
            known professionally as Freedo and Lani Colors, born on May 30th, 2000.
            This visionary artist and creative platform has been pushing the boundaries 
            of musical expression since its inception.
          </p>

          <div className="my-8">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
              alt="CODEe"
              className="rounded-lg w-full"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Artistic Vision</h2>
            <p>
              CODEe prides itself in its innovative approach to music creation,
              particularly in the mastery of frequency engineering and sound design.
              The platform combines experimental sounds with innovative rap flows,
              constantly pushing the boundaries of conventional genres.
            </p>

            <h2 className="text-2xl font-bold">Musical Journey</h2>
            <p>
              From its early days, CODEe has been dedicated to creating a new kind of rap,
              one that seamlessly blends experimental sounds with traditional elements.
              The work under the LANI COLORS project showcases an endless variety of new
              and experimental sounds, reflecting our commitment to musical innovation.
            </p>

            <h2 className="text-2xl font-bold">Creative Philosophy</h2>
            <p>
              Known for being endless in creativity, fearless in artistic choices,
              detailed in production, precise in execution, and determined in
              vision, CODEe continues to demonstrate vast ingenuity through each
              new release and project.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}