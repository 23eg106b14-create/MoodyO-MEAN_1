
'use client';

import { Music, Headphones, Guitar, ListMusic } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function MoodPlayer() {
  const [currentPage, setCurrentPage] = useState('home');

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
      cover: `https://picsum.photos/seed/m${baseIdx + i}/200/200`,
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

  const renderTile = (mood: string, t: any, idx: number) => {
    const id = `${mood}-aud-${idx}`;
    const Icon = t.icon;

    return (
      <div className="song-card" key={id}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative flex-shrink-0">
             <Image src={t.cover} alt={`${t.title} cover`} layout="fill" className="rounded-md object-cover" />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.artist}</p>
             <audio id={id} controls className="w-full mt-2" preload="none">
               <source src={t.src} type="audio/mpeg" />
             </audio>
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <Headphones className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">MoodyO</span>
        </div>
        <nav className="flex items-center gap-4">
            <button onClick={() => openPage('home')} className={`text-sm font-medium ${currentPage === 'home' ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>Home</button>
            {Object.keys(MOOD_DEFS).map(mood => (
                <button key={mood} onClick={() => openPage(mood)} className={`text-sm font-medium ${currentPage === mood ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>{MOOD_DEFS[mood].title}</button>
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
    </div>
  );
}
