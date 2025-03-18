import { Hero } from "@/components/home/Hero";
import { MusicGrid } from "@/components/music/MusicGrid";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Releases</h2>
        <MusicGrid />
      </div>
      <Newsletter />
    </div>
  );
}