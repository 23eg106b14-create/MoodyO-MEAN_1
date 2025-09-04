
'use client';

import { Music, Headphones, Guitar, ListMusic, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

export function MoodPlayer() {
  const [currentPage, setCurrentPage] = useState('home');
  const [nowPlaying, setNowPlaying] = useState<any>(null);

  const MOOD_DEFS: Record<string, any> = {
    happy: {
      title: 'Happy',
      subtitle: 'Bright, feel-good tracks to lift you up',
      emoji: '😊',
    },
    joyful: {
      title: 'Joyful',
      subtitle: 'High-energy songs for smiles and movement',
      emoji: '🤩',
    },
    sad: {
      title: 'Sad',
      subtitle: 'Slow, emotional tracks for reflection',
      emoji: '😢',
    },
    depression: {
      title: 'Depression',
      subtitle: 'Ambient textures and slow soundscapes',
      emoji: '😔',
    },
  };

  const ICONS = [Music, Headphones, Guitar, ListMusic];

  const SAMPLE_TRACKS = (baseIdx = 1) =>
    Array.from({ length: 10 }, (_, i) => ({
      title: ['Sunny Days', 'Golden Hour', 'Sparkle', 'Warm Breeze', 'Lemonade', 'Candy Skies', 'Bloom', 'Brightside', 'Hummingbird', 'Radiant'][i],
      artist: ['MoodyO Mix', 'Acoustic', 'Indie Pop', 'Lo-Fi', 'Electro Pop', 'Indie', 'Bedroom Pop', 'Folk', 'Chillhop', 'Dance'][i],
      src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(baseIdx + i) % 16 + 1}.mp3`,
      cover: `https://picsum.photos/seed/m${baseIdx + i}/400/400`,
      icon: ICONS[(baseIdx + i) % ICONS.length],
    }));

  const TRACKS: Record<string, any> = {
    happy: SAMPLE_TRACKS(0),
    joyful: SAMPLE_TRACKS(4),
    sad: SAMPLE_TRACKS(8),
    depression: SAMPLE_TRACKS(12),
  };

  const openPage = (id: string) => {
    setCurrentPage(id);
  };

  const handlePlay = (track: any) => {
    document.querySelectorAll('audio').forEach(a => a.pause());
    setNowPlaying(track);
  }

  const renderTile = (mood: string, t: any, idx: number) => {
    return (
      <div className="song-card cursor-pointer" key={`${mood}-${idx}`} onClick={() => handlePlay(t)}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative flex-shrink-0">
             <Image src={t.cover} alt={`${t.title} cover`} layout="fill" className="rounded-md object-cover" />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.artist}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderMoodPage = (mood: string) => {
    const def = MOOD_DEFS[mood];
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tighter">{def.title} {def.emoji}</h2>
          <p className="text-muted-foreground mt-1">{def.subtitle}</p>
        </div>
        <div className="song-grid">{TRACKS[mood].map((t: any, i: number) => renderTile(mood, t, i))}</div>
      </div>
    );
  };

  useEffect(() => {
    if (!nowPlaying) {
      document.querySelectorAll('audio').forEach(a => a.pause());
    }
  }, [nowPlaying]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <Headphones className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">MoodyO</span>
        </div>
        <nav className="flex items-center gap-4">
            <Button variant={currentPage === 'home' ? 'default' : 'ghost'} onClick={() => openPage('home')}>Home</Button>
            {Object.keys(MOOD_DEFS).map(mood => (
                <Button key={mood} variant={currentPage === mood ? 'default' : 'ghost'} onClick={() => openPage(mood)}>{MOOD_DEFS[mood].title}</Button>
            ))}
        </nav>
      </header>
      
      <main>
        <section id="home" className={`page ${currentPage === 'home' ? 'active' : ''}`}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">How are you feeling today?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Select a mood to explore curated audio experiences. Each one has its own unique vibe and color palette.</p>
          </div>
          <div className="emotion-grid">
            {Object.keys(MOOD_DEFS).map(mood => {
                const def = MOOD_DEFS[mood];
                return (
                    <div key={mood} className="emotion-card" onClick={() => openPage(mood)}>
                        <div className="flex items-start gap-4">
                           <span className="text-3xl">{def.emoji}</span>
                           <div>
                               <h3 className="text-xl font-bold">{def.title}</h3>
                               <p className="text-muted-foreground mt-1">{def.subtitle}</p>
                           </div>
                        </div>
                    </div>
                )
            })}
          </div>
        </section>
      
        {Object.keys(MOOD_DEFS).map(mood => (
          <section key={mood} id={mood} className={`page ${currentPage === mood ? 'active' : ''}`}>
            {currentPage === mood && renderMoodPage(mood)}
          </section>
        ))}
      </main>

       <footer className="text-center mt-20 py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">Made with ❤️ by MoodyO</p>
      </footer>

      {nowPlaying && (
        <Dialog open={!!nowPlaying} onOpenChange={(isOpen) => !isOpen && setNowPlaying(null)}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>{nowPlaying.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{nowPlaying.artist}</p>
            </DialogHeader>
            <div className="mt-4">
              <Image src={nowPlaying.cover} alt={`${nowPlaying.title} cover`} width={400} height={400} className="rounded-lg object-cover w-full aspect-square" />
            </div>
            <div className="mt-4">
              <audio controls autoPlay src={nowPlaying.src} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
