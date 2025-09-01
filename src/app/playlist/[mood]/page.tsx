import { Header } from '@/components/header';
import { Player } from '@/components/player';
import { PlaylistDisplay } from '@/components/playlist-display';
import { Suspense } from 'react';
import Loading from './loading';

export default function PlaylistPage({ params }: { params: { mood: string } }) {
  const { mood } = params;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense fallback={<Loading/>}>
          <PlaylistDisplay mood={mood} />
        </Suspense>
      </main>
      <Player />
    </div>
  );
}
