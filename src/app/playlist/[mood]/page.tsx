import { Suspense } from 'react';
import Loading from './loading';
import { PlaylistDisplay } from '@/components/playlist-display';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function PlaylistPage({ params }: { params: { mood: string } }) {
  const { mood } = params;

  return (
    <div className="flex flex-col min-h-screen">
       <Header />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<Loading/>}>
          <PlaylistDisplay mood={decodeURIComponent(mood)} />
        </Suspense>
      </main>
    </div>
  );
}
