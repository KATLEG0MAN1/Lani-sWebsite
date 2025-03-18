import { Link } from "wouter";
import { Music2, Mic2, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/about">
          <span className="text-2xl font-bold tracking-tighter cursor-pointer hover:text-primary transition-colors">Mr Freedo the Artist</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/"><span className="hover:text-primary transition-colors">Home</span></Link>
          <Link href="/music"><span className="hover:text-primary transition-colors">Music</span></Link>
          <Link href="/about"><span className="hover:text-primary transition-colors">About</span></Link>
          <div className="flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}