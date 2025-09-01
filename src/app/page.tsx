import Link from 'next/link';
import { Music2 } from 'lucide-react';
import { EmotionCard } from '@/components/emotion-card';
import { emotions } from '@/lib/constants';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <header className="text-center mb-12">
          <div className="inline-block p-4 sm:p-6 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 flex items-center gap-4">
              <Music2 className="w-10 h-10 md:w-14 md:h-14 text-white" />
              MoodyO
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-2">mood based audio</p>
          </div>
        </header>

        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {emotions.map((emotion) => (
              <EmotionCard key={emotion.name} emotion={emotion} />
            ))}
          </div>
        </div>

        <footer className="absolute bottom-4 text-center text-muted-foreground text-sm">
          <p>Created with Firebase and Genkit AI.</p>
           <Link href="/about" className="mt-2 text-sm text-accent-foreground/60 hover:text-accent-foreground transition-colors">
            About MoodyO
          </Link>
        </footer>
      </div>
    </main>
  );
}
