
'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

// Chart.js is used in a useEffect, so we need to import it here.
// We also need to import the necessary components for Chart.js to work.
import { Chart, registerables } from 'chart.js/auto';
Chart.register(...registerables);


export default function Home() {
  const [activePage, setActivePage] = useState('home');
  const [nowPlaying, setNowPlaying] = useState<{ track: any; mood: string; index: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const MOOD_DEFS: Record<string, any> = {
    happy: {
      title: 'Happy — Sunny Vibes',
      subtitle: 'Bright, feel-good tracks to lift you up',
      accent: '#f59e0b',
      bg: 'linear-gradient(135deg,#fff1c1 0%, #ffd194 40%, #ffb347 100%)',
      emoji: '😊',
      coverTint: '#ffd786',
      className: 'happy'
    },
    joyful: {
      title: 'Joyful — Energetic Beats',
      subtitle: 'High-energy songs — perfect for smiles and movement',
      accent: '#ec4899',
      bg: 'linear-gradient(135deg,#ffe0f2 0%, #ffb2e3 40%, #ff86c8 100%)',
      emoji: '🤩',
      coverTint: '#ffc2e9',
       className: 'joyful'
    },
    sad: {
      title: 'Sad — Melancholy',
      subtitle: 'Slow, emotional tracks to reflect',
      accent: '#60a5fa',
      bg: 'linear-gradient(135deg,#b6ccff 0%, #7aa2ff 40%, #4b6cff 100%)',
      emoji: '😢',
      coverTint: '#9fb8ff',
      className: 'sad'
    },
    depression: {
      title: 'Depression — Ambient & Soothing',
      subtitle: 'Ambient textures and slow soundscapes',
      accent: '#94a3b8',
      bg: 'linear-gradient(135deg,#6b7a83 0%, #3a4348 50%, #2a3136 100%)',
      emoji: '😔',
      coverTint: '#7b8a92',
      className: 'depression'
    }
  };

  const SAMPLE_TRACKS = (baseIdx = 1) => Array.from({length:10}, (_,i)=>({
      title: ['Sunny Days','Golden Hour','Sparkle','Warm Breeze','Lemonade','Candy Skies','Bloom','Brightside','Hummingbird','Radiant'][i],
      artist: ['MoodyO Mix','Acoustic','Indie Pop','Lo-Fi','Electro Pop','Indie','Bedroom Pop','Folk','Chillhop','Dance'][i],
      src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(baseIdx+i)%16 + 1}.mp3`,
      cover: `https://picsum.photos/seed/h${baseIdx+i}/600/600`
  }));

  const TRACKS: Record<string, any[]> = {
    happy: SAMPLE_TRACKS(0),
    joyful: SAMPLE_TRACKS(4),
    sad: SAMPLE_TRACKS(8),
    depression: SAMPLE_TRACKS(12)
  };

  const openPage = (id: string) => {
    setActivePage(id);
    if (MOOD_DEFS[id]) {
      applyTheme(id);
    }
  };

  const applyTheme = (mood: string) => {
    const def = MOOD_DEFS[mood];
    if (!def) return;
    document.body.style.background = def.bg;
    document.documentElement.style.setProperty('--page-accent', def.accent);
  };
  
  const handlePlay = (track: any, mood: string, index: number) => {
    setNowPlaying({ track, mood, index });
    setIsPlaying(true);
  };
  
  const handlePlayPause = () => {
    if(!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextPrev = (direction: 'next' | 'prev') => {
    if (!nowPlaying) return;

    const { mood, index } = nowPlaying;
    const playlist = TRACKS[mood];
    if (!playlist) return;
    let newIndex;

    if (direction === 'next') {
      newIndex = (index + 1) % playlist.length;
    } else {
      newIndex = (index - 1 + playlist.length) % playlist.length;
    }

    setNowPlaying({ track: playlist[newIndex], mood, index: newIndex });
    setIsPlaying(true);
  };


  useEffect(() => {
    if (nowPlaying && audioRef.current) {
        audioRef.current.src = nowPlaying.track.src;
        audioRef.current.load();
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [nowPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
     if (nowPlaying && isPlaying) {
        audioRef.current.play();
     } else {
       audioRef.current.pause();
     }
  }, [isPlaying]);


  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => handleNextPrev('next');
    audio?.addEventListener('ended', handleEnded);

    return () => {
      audio?.removeEventListener('ended', handleEnded);
    }
  }, [nowPlaying]);

  return (
    <div className="app">
      <header>
        <div className="logo glass">
          <div className="dot"></div>
          MoodyO
        </div>
        <nav>
          <button className="nav-btn glass" onClick={() => openPage('home')}>Home</button>
          {Object.keys(MOOD_DEFS).map(mood => (
            <button key={mood} className="nav-btn glass" onClick={() => openPage(mood)}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</button>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className={`page ${activePage === 'home' ? 'active' : ''}`}>
          <div className="glass">
            <h2>How are you feeling today?</h2>
            <p style={{opacity: 0.85}}>Tap a mood to explore curated songs and vibes. Each page has its own theme ✨</p>
            <div className="grid">
              {Object.keys(MOOD_DEFS).map(mood => {
                const def = MOOD_DEFS[mood];
                return (
                  <div key={mood} className={`emotion-card ${def.className}`} onClick={() => openPage(mood)}>
                    <div className="emoji">{def.emoji}</div>
                    <div className="title">{def.title.split('—')[0].trim()}</div>
                    <div className="subtitle">{def.subtitle}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {Object.keys(MOOD_DEFS).map(mood => {
          const def = MOOD_DEFS[mood];
          const tracks = TRACKS[mood];
          return (
            <section key={mood} id={mood} className={`page ${activePage === mood ? 'active' : ''}`}>
               <div className="glass">
                  <div className="page-header">
                    <div>
                      <h2>{def.title} <span className="badge">{def.emoji}</span></h2>
                      <small>{def.subtitle}</small>
                    </div>
                  </div>
                  <div className="song-grid">
                    {tracks.map((t, idx) => (
                      <div className="tile" key={idx} onClick={() => handlePlay(t, mood, idx)}>
                        <Image className="cover" src={t.cover} alt={`${t.title} cover`} width={200} height={200} data-ai-hint="song cover" />
                         <button className="play-small">▶</button>
                         <div className="tile-content">
                           <div className="song-title">{t.title}</div>
                           <div className="song-artist">{t.artist}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
            </section>
          )
        })}
      </main>
      
      <footer>
        <small>Made with ❤️ MoodyO — mood based audio UI demo</small>
      </footer>

      <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

      {nowPlaying && (
        <Dialog open={!!nowPlaying} onOpenChange={(isOpen) => {if (!isOpen) { setNowPlaying(null); setIsPlaying(false); }}}>
          <DialogContent className="max-w-md w-full glass">
            <DialogHeader>
              <DialogTitle>{nowPlaying.track.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{nowPlaying.track.artist}</p>
            </DialogHeader>
            <div className="mt-4">
              <Image src={nowPlaying.track.cover} alt={`${nowPlaying.track.title} cover`} width={400} height={400} className="rounded-lg object-cover w-full aspect-square" data-ai-hint="song cover" />
            </div>
            <div className="mt-6 flex items-center justify-center gap-6">
                <Button variant="ghost" size="icon" className="rounded-full h-14 w-14" onClick={() => handleNextPrev('prev')}>
                    <SkipBack className="h-8 w-8" />
                </Button>
                <Button variant="default" size="icon" className="rounded-full h-20 w-20" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-14 w-14" onClick={() => handleNextPrev('next')}>
                    <SkipForward className="h-8 w-8" />
                </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    