import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-muted-foreground">
              Email: contact@codee.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="space-y-2 text-muted-foreground">
              <a href="#" className="block hover:text-primary">Instagram</a>
              <a href="#" className="block hover:text-primary">Twitter</a>
              <a href="#" className="block hover:text-primary">YouTube</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Music Platforms</h3>
            <div className="space-y-2 text-muted-foreground">
              <a href="#" className="block hover:text-primary">Spotify</a>
              <a href="#" className="block hover:text-primary">Apple Music</a>
              <a href="#" className="block hover:text-primary">SoundCloud</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          © 2024 CODEe (COME OUTSIDE DIRECTIVE ENTERTAINMENT). All rights reserved.
        </div>
      </div>
    </footer>
  );
}