'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SkipBack, SkipForward, Play, Pause, X, Heart, Pin, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// GSAP Plugin registration
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

// --- Data Definitions ---
const MOOD_DEFS = {
  happy: {
    title: 'Happy — Vibrant Beats',
    subtitle: 'Feel-good tracks with a deep groove',
    accent: '#FFB347',
    bg: 'linear-gradient(135deg, #FFF8E1 0%, #FFE066 100%)',
    emoji: '😄',
  },
  joyful: {
    title: 'Joyful — Energetic Beats',
    subtitle: 'High-energy songs — perfect for smiles and movement',
    accent: '#FF4081',
    bg: 'linear-gradient(135deg, #FFF0F6 0%, #FF6EC7 100%)',
    emoji: '🥳',
  },
  sad: {
    title: 'Sad — Melancholy',
    subtitle: 'Slow, emotional tracks to reflect',
    accent: '#2196F3',
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #6EC6FF 100%)',
    emoji: '😢',
  },
  depression: {
    title: 'Depression — Ambient & Soothing',
    subtitle: 'Ambient textures and slow soundscapes',
    accent: '#5E3370',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    emoji: '😔',
  }
};

type Track = {
  title: string;
  artist: string;
  src: string;
  cover: string;
};


const SAMPLE_TRACKS = (baseIdx = 1): Track[] => Array.from({ length: 10 }, (_, i) => ({
  title: ['Sunny Days', 'Golden Hour', 'Sparkle', 'Warm Breeze', 'Lemonade', 'Candy Skies', 'Bloom', 'Brightside', 'Hummingbird', 'Radiant'][i],
  artist: ['MoodyO Mix', 'Acoustic', 'Indie Pop', 'Lo-Fi', 'Electro Pop', 'Indie', 'Bedroom Pop', 'Folk', 'Chillhop', 'Dance'][i],
  src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(baseIdx + i) % 16 + 1}.mp3`,
  cover: `https://picsum.photos/seed/h${baseIdx + i}/600/600`
}));

const TRACKS = {
  happy: SAMPLE_TRACKS(0),
  joyful: SAMPLE_TRACKS(4),
  sad: SAMPLE_TRACKS(8),
  depression: SAMPLE_TRACKS(12)
};

const MOON_ICONS = [
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/cursor.svg', alt: 'cursor' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/eyes.svg', alt: 'eyes' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/light.svg', alt: 'light' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/planet.svg', alt: 'planet' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/pointer.svg', alt: 'pointer' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/03/award.svg', alt: 'award' },
  { src: 'https://cydstumpel.nl/wp-content/uploads/2025/01/plant.svg', alt: 'plant' },
];


export default function Home() {
  const [appVisible, setAppVisible] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [nowPlaying, setNowPlaying] = useState<{ mood: string; index: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNewFeatureSheetOpen, setIsNewFeatureSheetOpen] = useState(false);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [headerStuck, setHeaderStuck] = useState(false);


  const audioRef = useRef<HTMLAudioElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const moonRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hero Animations
  useEffect(() => {
    if (appVisible) return;

    const header = headerRef.current;
    if (!header) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to([titleTopRef.current, titleBottomRef.current], {
        '--perspective-x': x * 15,
        '--perspective-y': y * -15,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    moonRefs.current.forEach((moon, i) => {
      if (moon) {
        gsap.to(moon, {
          motionPath: {
            path: '#motionpath-path',
            align: '#motionpath-path',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: i / MOON_ICONS.length,
            end: i / MOON_ICONS.length + 0.5,
          },
          duration: 40,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
         gsap.to(moon, {
          x: '+=random(-20, 20)',
          y: '+=random(-20, 20)',
          rotation: '+=random(-15, 15)',
          repeat: -1,
          yoyo: true,
          duration: 5,
          ease: 'power1.inOut',
        });
      }
    });

    header.addEventListener('mousemove', onMouseMove);
    return () => header.removeEventListener('mousemove', onMouseMove);
  }, [appVisible]);

  // Audio Player Logic
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, nowPlaying]);

  // Home page entrance animation
  useEffect(() => {
    if (appVisible && activePage === 'home') {
      const homeTitle = document.querySelector('#home .home-title');
      const homeSubtitle = document.querySelector('#home .home-subtitle');
      const cards = document.querySelectorAll('.emotion-card-new');
      
      const tl = gsap.timeline();
      tl.fromTo(homeTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo(homeSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.4")
        .fromTo(cards, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.4)' }, "-=0.4");
    }
  }, [appVisible, activePage]);


  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleSongEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    if (!nowPlaying) return;
    const { mood, index } = nowPlaying;
    const playlist = TRACKS[mood as keyof typeof TRACKS];
    const nextIndex = (index + 1) % playlist.length;
    setNowPlaying({ mood, index: nextIndex });
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!nowPlaying) return;
    const { mood, index } = nowPlaying;
    const playlist = TRACKS[mood as keyof typeof TRACKS];
    const prevIndex = (index - 1 + playlist.length) % playlist.length;
    setNowPlaying({ mood, index: prevIndex });
    setIsPlaying(true);
  };
  
  const openPlayer = (mood: string, index: number) => {
    const playlist = TRACKS[mood as keyof typeof TRACKS];
    setNowPlaying({ mood, index: index % playlist.length });
    setIsPlaying(true);
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setNowPlaying(null);
  };

  const isLiked = (track: Track) => {
    return likedSongs.some(likedTrack => likedTrack.src === track.src);
  }

  const handleLike = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    setLikedSongs(prev => {
      if (isLiked(track)) {
        return prev.filter(likedTrack => likedTrack.src !== track.src);
      } else {
        return [...prev, track];
      }
    });
  }

  const enterApp = () => {
      gsap.to(headerRef.current, {
        duration: 0.8,
        opacity: 0,
        y: -50,
        ease: 'power3.in',
        onComplete: () => {
            setAppVisible(true);
            openPage('home');
        }
      });
  };

  const openPage = (id: string) => {
    setActivePage(id);
    document.body.className = id ? `${id}-active` : '';
    
    const moodDef = MOOD_DEFS[id as keyof typeof MOOD_DEFS];
    if (moodDef) {
        document.body.style.background = moodDef.bg;
        document.documentElement.style.setProperty('--page-accent', moodDef.accent);
        gsap.fromTo('body',{backgroundPosition:'60% 60%'},{duration:.8,backgroundPosition:'40% 40%',ease:'power2.out'});
    } else {
        document.body.style.background = 'linear-gradient(135deg, #1d2b3c 0%, #0f1724 100%)';
        document.body.style.color = '';
    }
    setIsMenuSheetOpen(false);
  };

  const currentTrack = nowPlaying ? TRACKS[nowPlaying.mood as keyof typeof TRACKS][nowPlaying.index] : null;

  const NavMenu = () => (
    <Accordion type="single" collapsible className="w-full mobile-menu" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="accordion-trigger">Playlist</AccordionTrigger>
        <AccordionContent className="accordion-content">
          {likedSongs.length > 0 ? (
            <ul className="mobile-menu-items">
              {likedSongs.map((track, index) => (
                <li key={index}><a href="#">{track.title}</a></li>
              ))}
            </ul>
          ) : (
            <p className="px-4 text-sm opacity-80">No liked songs yet.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      {!appVisible && (
        <section className="homepage-header" ref={headerRef} onClick={enterApp}>
            <div className="homepage-header__titles">
              <h1 className="sr-only">MoodyO</h1>
              <h1
                className="homepage-header__title homepage-header__title--top huge-hero"
                aria-hidden="true"
                ref={titleTopRef}
              >
                Moody
              </h1>
              <div className="moons">
                {MOON_ICONS.map((moon, i) => (
                  <div
                    className="item"
                    aria-hidden="true"
                    key={moon.alt}
                    ref={(el) => (moonRefs.current[i] = el)}
                  >
                    <Image loading="lazy" src={moon.src} alt={moon.alt} width={80} height={80} data-ai-hint="icon decoration" />
                  </div>
                ))}
              </div>
    
              <svg
                aria-hidden="true"
                className="motionpath"
                viewBox="0 0 1474 782"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="motionpath-path"
                  d="M723.5 35.0001C1144.17 -39.9999 1836.8 -41.2999 1242 553.5C498.5 1297 -832.5 -25.9997 723.5 35.0001Z"
                ></path>
              </svg>
    
              <h1
                className="homepage-header__title homepage-header__title--bottom huge-hero"
                aria-hidden="true"
                ref={titleBottomRef}
              >
                O
              </h1>
            </div>
        </section>
      )}

      {appVisible && (
        <div className="app">
              <header className={cn({ 'stuck': headerStuck })}>
                <div className="header-inner">
                    <div className="logo">
                      <div className="dot"></div>
                      MoodyO
                    </div>
                    <nav>
                      <Sheet open={isMenuSheetOpen} onOpenChange={setIsMenuSheetOpen}>
                        <SheetTrigger asChild>
                           <button className="nav-btn">
                            <Menu size={20} />
                          </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="main-menu-sheet sheet-content">
                          <SheetHeader>
                            <a href="#" className="logo">MoodyO</a>
                          </SheetHeader>
                          <div className="flex flex-col">
                            {['home', ...Object.keys(MOOD_DEFS)].map(mood => (
                              <a key={mood} href="#" onClick={() => openPage(mood)}>
                                {mood.charAt(0).toUpperCase() + mood.slice(1)}
                              </a>
                            ))}
                             <a href="#" onClick={() => setIsNewFeatureSheetOpen(true)}>New Feature</a>
                          </div>
                        </SheetContent>
                      </Sheet>
                       <button className={cn('nav-btn', 'pin-btn', { 'active': headerStuck })} onClick={() => setHeaderStuck(!headerStuck)}>
                        <Pin size={18} />
                      </button>
                    </nav>
                </div>
              </header>

            <Sheet open={isNewFeatureSheetOpen} onOpenChange={setIsNewFeatureSheetOpen}>
              <SheetContent className="sheet-content">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="offcanvas-header">
                      <a href="#" className="logo">
                          <div className="logo glass" style={{padding: '12px 18px', gap: '8px'}}>
                            MoodyO
                          </div>
                      </a>
                      <SheetClose>
                        <X size={24} />
                        <span className="sr-only">Close</span>
                      </SheetClose>
                  </div>
                  <div className="p-4">
                    <NavMenu />
                  </div>
              </SheetContent>
            </Sheet>

          <main>
            <section id="home" className={cn('page', { active: activePage === 'home' })}>
                <div className="home-intro">
                    <h2 className="home-title">How are you feeling today?</h2>
                    <p className="home-subtitle" style={{ opacity: .85 }}>Tap a mood to explore curated songs and vibes. Each page has its own theme ✨</p>
                </div>
                <div className="home-mood-selector">
                  {Object.entries(MOOD_DEFS).map(([key, { emoji, title }]) => (
                    <div key={key} className={cn('emotion-card-new', key)} onClick={() => openPage(key)}>
                      <div className="card-content">
                        <div className="emoji">{emoji}</div>
                        <div className="title">{title.split('—')[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
            </section>

            {Object.entries(MOOD_DEFS).map(([mood, def]) => (
              <section key={mood} id={mood} className={cn('page', { active: activePage === mood })}>
                <div className="glass">
                  <div className="page-header">
                    <div>
                      <h2>{def.title} <span className="badge">{def.emoji}</span></h2>
                      <small>{def.subtitle}</small>
                    </div>
                  </div>
                  <div className="song-grid-container">
                    <div className="song-grid">
                      {[...TRACKS[mood as keyof typeof TRACKS], ...TRACKS[mood as keyof typeof TRACKS]].map((track, index) => (
                        <div key={index} className="song-card" onClick={() => openPlayer(mood, index)}>
                          <Image className="cover" src={track.cover} alt={`${track.title} cover`} width={200} height={200} data-ai-hint="song cover" />
                          <div className="song-card-content">
                            <div className="song-title-wrapper">
                                <button onClick={(e) => handleLike(e, track)} className={cn('like-btn', { 'liked': isLiked(track) })}>
                                  <Heart size={18} />
                                </button>
                                <div className="song-title">{track.title}</div>
                            </div>
                            <div className="song-artist">{track.artist}</div>
                            <button className="play-small">▶</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </main>

          <footer>
            <small>Made with ❤️ MoodyO — mood based audio UI demo</small>
          </footer>
        </div>
      )}

      {nowPlaying && currentTrack && (
        <div className="player-dialog-overlay">
            <div className="player-dialog glass">
                <button onClick={closePlayer} className="player-close-btn"><X size={24} /></button>
                <Image className="player-cover" src={currentTrack.cover} alt={currentTrack.title} width={400} height={400} data-ai-hint="song cover" />
                <div className="player-info">
                    <h3>{currentTrack.title}</h3>
                    <p>{currentTrack.artist}</p>
                </div>
                 <div className="player-controls">
                    <button onClick={handlePrev}><SkipBack /></button>
                    <button onClick={handlePlayPause} className="play-main-btn">
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button onClick={handleNext}><SkipForward /></button>
                </div>
                 <div className="player-actions">
                    <button onClick={(e) => handleLike(e, currentTrack)} className={cn('like-btn', { 'liked': isLiked(currentTrack) })}>
                        <Heart size={24} />
                    </button>
                </div>
                <audio ref={audioRef} src={currentTrack.src} onEnded={handleSongEnd} onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} />
            </div>
        </div>
      )}
    </>
  );
}
