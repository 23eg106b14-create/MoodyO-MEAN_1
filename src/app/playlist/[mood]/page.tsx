import { Suspense } from 'react';
import Loading from './loading';
import { PlaylistDisplay } from '@/components/playlist-display';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PlaylistPage({ params }: { params: { mood: string } }) {
  const { mood } = params;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
       <header className="absolute top-0 left-0 z-50 p-4">
        <Link href="/" className="group inline-flex items-center justify-center p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg hover:bg-black/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white transition-transform group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<Loading/>}>
          <PlaylistDisplay mood={mood} />
        </Suspense>
      </main>
      <footer className="w-full py-6 flex items-center justify-center gap-4">
          <Button asChild variant="ghost" className="bg-black/20 text-white/80 hover:bg-black/30 hover:text-white rounded-full">
            <Link href="/about">About Us</Link>
          </Button>
          <Button asChild variant="ghost" className="bg-black/20 text-white/80 hover:bg-black/30 hover:text-white rounded-full">
            <Link href="/">Playlists</Link>
          </Button>
          <Button asChild variant="ghost" className="bg-black/20 text-white/80 hover:bg-black/30 hover:text-white rounded-full">
            <Link href="/">Home</Link>
          </Button>
        </footer>
    </div>
  );
}
