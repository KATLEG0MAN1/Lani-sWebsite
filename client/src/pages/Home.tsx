import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid />
      </div>
      <Newsletter />
    </div>
  );
}
