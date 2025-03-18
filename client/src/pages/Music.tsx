import { motion } from "framer-motion";
import { MusicGrid } from "@/components/music/MusicGrid";

export default function Music() {
  return (
    <div className="container mx-auto px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Music</h1>
        <p className="text-muted-foreground mb-12">
          Explore the latest tracks and albums from LANI COLORS. Click on any track to
          listen on Spotify.
        </p>
        <MusicGrid />
      </motion.div>
    </div>
  );
}
