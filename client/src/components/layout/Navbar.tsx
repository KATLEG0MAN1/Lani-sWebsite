import { Link } from "wouter";
import { Music2, Mic2, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold tracking-tighter">Mr Freedo the Artist</a>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link>
          <Link href="/music"><a className="hover:text-primary transition-colors">Music</a></Link>
          <Link href="/about"><a className="hover:text-primary transition-colors">About</a></Link>
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