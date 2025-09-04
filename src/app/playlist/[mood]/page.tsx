import { Suspense } from 'react';
import Loading from './loading';
import { PlaylistDisplay } from '@/components/playlist-display';
import Link from 'next/link';
import { Header } from '@/components/header';
import { emotions } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function PlaylistPage({ params }: { params: { mood: string } }) {
  const { mood } = params;
  const emotion = emotions.find((e) => e.name.toLowerCase() === mood.toLowerCase());

  return (
    <div className={cn("flex flex-col min-h-screen", emotion?.color)}>
       <Header />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<Loading/>}>
          <PlaylistDisplay mood={decodeURIComponent(mood)} />
        </Suspense>
      </main>
    </div>
  );
}
