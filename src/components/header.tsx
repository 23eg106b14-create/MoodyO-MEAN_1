import Link from 'next/link';
import { Music2 } from 'lucide-react';
import { Nav } from './nav';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg">
              <Music2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">MoodyO</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <Nav />
        </div>
      </div>
    </header>
  );
}
