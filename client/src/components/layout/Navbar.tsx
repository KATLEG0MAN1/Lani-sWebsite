import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold tracking-tighter">GOLF le FLEUR*</a>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link>
          <Link href="/about"><a className="hover:text-primary transition-colors">About</a></Link>
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
