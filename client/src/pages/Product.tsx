import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="animate-pulse">
          <div className="h-96 bg-muted rounded-lg mb-8" />
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/4 mb-8" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl mb-8">${(product.price / 100).toFixed(2)}</p>
          <p className="text-muted-foreground mb-8">{product.description}</p>
          <Button size="lg" className="w-full md:w-auto">
            Add to Cart
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
