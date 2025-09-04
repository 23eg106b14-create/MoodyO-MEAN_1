import Link from 'next/link';
import { Music2 } from 'lucide-react';
import { EmotionCard } from '@/components/emotion-card';
import { emotions } from '@/lib/constants';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-12 md:py-20 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-primary">Find Your Vibe</h1>
            <p className="mt-4 text-lg text-muted-foreground">Select a mood to generate a playlist.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {emotions.map((emotion) => (
              <EmotionCard key={emotion.name} emotion={emotion} />
            ))}
          </div>
        </div>
      </main>
       <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>Created with Firebase and Genkit AI.</p>
       </footer>
    </div>
  );
}
