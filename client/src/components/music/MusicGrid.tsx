import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Track } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Music2, Youtube } from "lucide-react";

export function MusicGrid() {
  const { data: tracks, isLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-96 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tracks?.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="aspect-square overflow-hidden rounded-lg relative">
            <img
              src={track.imageUrl}
              alt={track.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <a href={track.videoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  Watch on YouTube
                </Button>
              </a>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">{track.title}</h3>
            <p className="text-muted-foreground">{track.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}