
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkipBack, SkipForward, Play, Pause, X, Heart, Menu, Wand2, Loader, Smile, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateMood, GenerateMoodInput, GenerateMoodOutput } from '@/ai/flows/mood-generator';
import { generateImage } from '@/ai/flows/image-generator';
import { ThemeProvider } from '@/components/theme-provider';

// --- Data Definitions ---
type MoodDefinition = {
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  emoji: string;
  themeClass: string;
};

const MOOD_DEFS: { [key: string]: MoodDefinition } = {
  happy: {
    title: 'Happy — Vibrant Beats',
    subtitle: 'Feel-good tracks with a deep groove',
    accent: '#FFB347',
    bg: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)',
    emoji: '😄',
    themeClass: 'happy-active',
  },
  joyful: {
    title: 'Joyful — Energetic Beats',
    subtitle: 'High-energy songs — perfect for smiles and movement',
    accent: '#FF4081',
    bg: 'linear-gradient(135deg, #FFF0F6 0%, #FF80AB 100%)',
    emoji: '🥳',
    themeClass: 'joyful-active',
  },
  sad: {
    title: 'Sad — Melancholy',
    subtitle: 'Slow, emotional tracks to reflect',
    accent: '#2196F3',
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)',
    emoji: '😢',
    themeClass: 'sad-active',
  },
  depression: {
    title: 'Depression — Ambient & Soothing',
    subtitle: 'Ambient textures and slow soundscapes',
    accent: '#5E3370',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    emoji: '😔',
    themeClass: 'depression-active',
  }
};

type Track = {
  title: string;
  artist: string;
  src: string;
  cover: string;
  mood?: string;
  index?: number;
};


// Function to fetch songs from backend
const fetchSongs = async (emotion: string): Promise<Track[]> => {
  try {
    const response = await fetch(`/api/songs/${emotion}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch songs for ${emotion}`);
    }
    const songs = await response.json();
    return songs.map((song: any) => ({
      title: song.title,
      artist: song.artist,
      src: song.src,
      cover: song.cover,
      mood: emotion
    }));
  } catch (error) {
    console.error(`Error fetching songs for ${emotion}:`, error);
    // Fallback to sample tracks if backend fails
    return SAMPLE_TRACKS(emotion === 'happy' ? 0 : emotion === 'joyful' ? 4 : emotion === 'sad' ? 8 : 12);
  }
};

const SAMPLE_TRACKS = (baseIdx = 1): Track[] => Array.from({ length: 10 }, (_, i) => ({
  title: ['Sunny Days', 'Golden Hour', 'Sparkle', 'Warm Breeze', 'Lemonade', 'Candy Skies', 'Bloom', 'Brightside', 'Hummingbird', 'Radiant'][i],
  artist: ['MoodyO Mix', 'Acoustic', 'Indie Pop', 'Lo-Fi', 'Electro Pop', 'Indie', 'Bedroom Pop', 'Folk', 'Chillhop', 'Dance'][i],
  src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(baseIdx + i) % 16 + 1}.mp3`,
  cover: `https://picsum.photos/seed/h${baseIdx + i}/600/600`
}));

const STATIC_TRACKS = {
  happy: SAMPLE_TRACKS(0),
  joyful: SAMPLE_TRACKS(4),
  sad: SAMPLE_TRACKS(8),
  depression: SAMPLE_TRACKS(12)
};

const AnimatedText = ({ text, className, as: Component = 'div' }: { text: string, className?: string, as?: React.ElementType }) => {
  return (
    <Component className={cn(className)}>
      {text.split("").map((char, index) => (
        <span key={index} className="char" style={{ '--char-index': index } as React.CSSProperties}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  );
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [nowPlaying, setNowPlaying] = useState<{ mood: string; index: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [isCustomMoodDialogOpen, setIsCustomMoodDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customMoods, setCustomMoods] = useState<Record<string, MoodDefinition>>({});
  const [tracks, setTracks] = useState<Record<string, Track[] | undefined>>({});
  const [customMoodFormData, setCustomMoodFormData] = useState({ name: '', emoji: '', description: '' });

  const audioRef = useRef<HTMLAudioElement>(null);
  const introHeroRef = useRef<HTMLDivElement>(null);
  const introHeroContentRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const homePageRef = useRef<HTMLElement>(null);
  const mainAppRef = useRef<HTMLDivElement>(null);
  const interactiveTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Hero Animations
  useEffect(() => {
    if (!isMounted || !appVisible) return;
    const heroSection = homePageRef.current?.querySelector('.creative-hero');
    if (!heroSection) return;

    const heroContent = heroSection.querySelector('.hero-content');
    if (!heroContent) return;

    const onMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const { clientX, clientY } = mouseEvent;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(heroContent, {
        rotateY: x * 15,
        rotateX: y * -15,
        ease: 'power1.out',
      });
    };

    heroSection.addEventListener('mousemove', onMouseMove);

    return () => {
      heroSection.removeEventListener('mousemove', onMouseMove)
    };
  }, [appVisible, isMounted]);

  // Home Page Scroll Animations
  useEffect(() => {
    if (!isMounted || activePage !== 'home' || !homePageRef.current) return;
        
    const sections = homePageRef.current.querySelectorAll('.home-section-animate');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
    
    // Scramble Animation for interactive title
    const titleEl = interactiveTitleRef.current;
    if (titleEl) {
        const chars = titleEl.querySelectorAll('.char');
        gsap.set(chars, {
          x: () => gsap.utils.random(-250, 250),
          y: () => gsap.utils.random(-250, 250),
          rotation: () => gsap.utils.random(-360, 360),
          opacity: 0,
        });

        gsap.to(chars, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.03,
          scrollTrigger: {
            trigger: titleEl,
            start: 'top 90%',
            end: 'bottom 50%',
            scrub: 1.5,
          }
        });
    }
    
    const cards = document.querySelectorAll('.how-it-works-step');
    cards.forEach(card => {
        const htmlCard = card as HTMLElement;
        const onMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = htmlCard.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;
            htmlCard.style.setProperty('--x', `${x}px`);
            htmlCard.style.setProperty('--y', `${y}px`);
        };
        htmlCard.addEventListener('mousemove', onMouseMove);

        return () => htmlCard.removeEventListener('mousemove', onMouseMove);
    });


  }, [activePage, appVisible, isMounted]);

  // Mood Page Animation
  useEffect(() => {
    if (!isMounted) return;
    let animation: gsap.core.Tween | undefined;
    if (activePage && activePage !== 'home') {
      const page = document.getElementById(activePage);
      if (page) {
        animation = gsap.fromTo(page.querySelector('.glass'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      }
    }
    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [activePage, isMounted]);

  // Custom Cursor Animation
  useEffect(() => {
    if (!isMounted) return;
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power3.out',
      });
      gsap.to(cursorRingRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isMounted]);

  // Load tracks for active mood
  useEffect(() => {
    if (activePage && activePage !== 'home' && !tracks[activePage]) {
      fetchSongs(activePage).then(fetchedTracks => {
        setTracks(prev => ({
          ...prev,
          [activePage]: fetchedTracks
        }));
      });
    }
  }, [activePage, tracks]);

  // Stop music when navigating away from a mood page
  useEffect(() => {
    if (nowPlaying && activePage !== nowPlaying.mood) {
      setIsPlaying(false);
    }
  }, [activePage, nowPlaying]);


  // Audio Player Logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Playback prevented by browser policy. User interaction is required to start audio.');
          setIsPlaying(false);
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, nowPlaying]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleSongEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    if (!nowPlaying) return;
    const { mood, index } = nowPlaying;
    const playlist = tracks[mood as keyof typeof tracks];
    if (!playlist) return;
    const nextIndex = (index + 1) % playlist.length;
    setNowPlaying({ mood, index: nextIndex });
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!nowPlaying) return;
    const { mood, index } = nowPlaying;
    const playlist = tracks[mood as keyof typeof tracks];
    if (!playlist) return;
    const prevIndex = (index - 1 + playlist.length) % playlist.length;
    setNowPlaying({ mood, index: prevIndex });
    setIsPlaying(true);
  };
  
  const openPlayer = (mood: string, index: number) => {
    const playlist = tracks[mood as keyof typeof tracks];
    if (!playlist) return;
    setNowPlaying({ mood, index: index % playlist.length });
    setIsPlaying(true);
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setNowPlaying(null);
  };

  const isLiked = (track: Track) => {
    return likedSongs.some(likedTrack => likedTrack.src === track.src);
  };

  const handleLike = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    const target = e.currentTarget;
    gsap.fromTo(target, { scale: 1 }, { scale: 1.3, duration: 0.2, ease: 'back.out(1.7)', yoyo: true, repeat: 1 });

    setLikedSongs(prev => {
      if (isLiked(track)) {
        return prev.filter(likedTrack => likedTrack.src !== track.src);
      } else {
        const trackWithContext = { ...track, mood: track.mood || nowPlaying?.mood, index: track.index ?? nowPlaying?.index };
        return [...prev, trackWithContext];
      }
    });
  };

 const openPage = (id: string) => {
    setActivePage(id);
    setIsMenuSheetOpen(false);
  };

  const enterApp = () => {
      const tl = gsap.timeline({
        onComplete: () => {
            setAppVisible(true);
        }
      });

      tl.to(introHeroContentRef.current, {
        duration: 0.8,
        opacity: 0,
        scale: 0.8,
        ease: 'power3.in',
      })
      .to(introHeroRef.current, {
        duration: 0.6,
        opacity: 0,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(introHeroRef.current, { display: 'none' });
        }
      }, "-=0.6");
  };

  const handleGenerateMood = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customMoodFormData.name || !customMoodFormData.emoji || !customMoodFormData.description) return;
    
    setIsGenerating(true);
    setIsCustomMoodDialogOpen(false);

    const input: GenerateMoodInput = customMoodFormData;

    try {
      const result = await generateMood(input);
      const moodId = input.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

      setCustomMoods(prev => ({
        ...prev,
        [moodId]: {
          title: `${result.title} — AI Generated`,
          subtitle: result.subtitle,
          accent: result.theme.accent,
          bg: `linear-gradient(135deg, ${result.theme.start} 0%, ${result.theme.end} 100%)`,
          emoji: input.emoji,
          themeClass: 'custom-theme-active'
        }
      }));

      const initialTracks = result.playlist.map((song, index) => ({
        ...song,
        src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(1 + index) % 16 + 1}.mp3`,
        cover: '/placeholder-cover.png',
      }));

      setTracks(prev => ({
        ...prev,
        [moodId]: initialTracks,
      }));
      
      openPage(moodId);
      setCustomMoodFormData({ name: '', emoji: '', description: '' });

      const imagePromises = result.playlist.map(async (song, index) => {
        const imageResult = await generateImage({ prompt: `${song.title} by ${song.artist}, ${input.description}` });
        return { 
          index, 
          cover: imageResult.imageUrl || `https://picsum.photos/seed/${moodId}${index}/600/600` 
        };
      });

      const settledImages = await Promise.all(imagePromises);

      setTracks(prev => {
        const newTracks = [...(prev[moodId] || [])];
        settledImages.forEach(({ index, cover }) => {
          if (newTracks[index]) {
            newTracks[index] = { ...newTracks[index], cover };
          }
        });
        return { ...prev, [moodId]: newTracks };
      });

    } catch (error) {
      console.error("Failed to generate mood:", error);
      // Optionally, show a toast or notification to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTrack = nowPlaying ? tracks[nowPlaying.mood as keyof typeof tracks]?.[nowPlaying.index] : null;
  const allMoods = { ...MOOD_DEFS, ...customMoods };
  const isFormValid = customMoodFormData.name && customMoodFormData.emoji && customMoodFormData.description;

  const NavMenu = () => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="accordion-trigger">My Playlist</AccordionTrigger>
        <AccordionContent>
          {likedSongs.length > 0 ? (
            <ul className="mobile-menu-items">
              {likedSongs.map((track, index) => (
                <li key={index}>
                  <a href="#" className="playlist-item" onClick={(e) => { e.preventDefault(); openPlayer(track.mood!, track.index!) }}>
                    <Image src={track.cover} alt={track.title} width={40} height={40} className="playlist-item-cover" data-ai-hint="song cover" />
                    <span>{track.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-1 text-sm opacity-80">Your liked songs will appear here.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  const InteractiveTitle = ({ text, className, as: Component = 'h2' }: { text: string, className?: string, as?: React.ElementType }) => {
    return (
      <Component className={cn(className)} ref={interactiveTitleRef}>
        {text.split("").map((char, index) => (
          <span key={index} className="char" style={{ '--char-index': index } as React.CSSProperties}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </Component>
    );
  };


  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      <ThemeProvider
        activePage={activePage}
        customMoods={customMoods}
        tracks={tracks as Record<string, Track[]>}
        nowPlaying={nowPlaying}
        allMoods={allMoods}
      />
      <div id="cursor-dot" ref={cursorDotRef} />
      <div id="cursor-ring" ref={cursorRingRef} />
      
      {!appVisible && (
        <section className="creative-hero" ref={introHeroRef} onClick={enterApp}>
            <div className="hero-content" ref={introHeroContentRef}>
              <h1 className="sr-only">MoodyO</h1>
              <AnimatedText text="MoodyO" className="word" as="div" />
            </div>
        </section>
      )}

      {appVisible && (
        <div className="app" ref={mainAppRef}>
          <header>
            <div className="header-inner">
                <div className="logo">
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
                         <SheetTitle className="sr-only">Main Menu</SheetTitle>
                        <a href="#" onClick={(e) => { e.preventDefault(); openPage('home'); }} className="logo">MoodyO</a>
                      </SheetHeader>
                      <div className="flex flex-col py-4">
                         <a href="#" onClick={(e) => { e.preventDefault(); openPage('home'); }}>Home</a>
                        {Object.keys(allMoods).map(mood => (
                          <a key={mood} href="#" onClick={(e) => { e.preventDefault(); openPage(mood); }}>
                            {allMoods[mood].title.split('—')[0]}
                          </a>
                        ))}
                        <a href="/admin" target="_blank" className="text-purple-400 hover:text-purple-300 mt-2">
                          Admin Panel
                        </a>
                      </div>
                       <div className="p-4 border-t border-glass-border">
                         <NavMenu />
                       </div>
                    </SheetContent>
                  </Sheet>
                </nav>
            </div>
          </header>

          <main>
            <section id="home" className={cn('page', {active: activePage === 'home'})} ref={homePageRef}>
                <div className="home-section creative-hero">
                  <div className="hero-content">
                    <h1 className="sr-only">MoodyO</h1>
                    <AnimatedText text="MoodyO" className="word" as="div" />
                  </div>
                </div>

                <div className="home-section home-section-animate">
                    <InteractiveTitle text="How are you feeling today?" className="interactive-title" />
                    <p className="home-subtitle">Tap a mood to explore curated songs and vibes. Each page has its own theme ✨</p>
                </div>

                <div className="home-section home-section-animate">
                  <div className="home-mood-selector">
                    {Object.entries(allMoods).map(([key, { emoji, title }]) => (
                      <div key={key} className={cn('emotion-card-new', key)} onClick={() => openPage(key)}>
                        <div className="card-content">
                          <div className="emoji">{emoji}</div>
                          <div className="title">{title.split('—')[0]}</div>
                        </div>
                      </div>
                    ))}
                    <div className="emotion-card-new create-mood-card" onClick={() => setIsCustomMoodDialogOpen(true)}>
                      <div className="card-content">
                        <div className="emoji"><Wand2 size={72} /></div>
                        <div className="title">Create Your Own</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="home-section home-section-animate">
                    <AnimatedText text="How It Works" className="interactive-title" as="h2" />
                    <p className="home-subtitle">Three easy steps to your perfect vibe.</p>
                    <div className="how-it-works-grid">
                      <div className="how-it-works-step">
                        <Smile className="icon" />
                        <h3>1. Choose Your Mood</h3>
                        <p>Select from our curated moods or get creative and generate your own with AI.</p>
                      </div>
                      <div className="how-it-works-step">
                        <Wand2 className="icon" />
                        <h3>2. Get Your Vibe</h3>
                        <p>Instantly receive a unique playlist, color theme, and atmosphere tailored to you.</p>
                      </div>
                      <div className="how-it-works-step">
                        <Music className="icon" />
                        <h3>3. Listen & Enjoy</h3>
                        <p>Immerse yourself in the music and discover new tracks that perfectly match your feeling.</p>
                      </div>
                    </div>
                </div>

            </section>

            {Object.entries(allMoods).map(([mood, def]) => {
              const playlist = tracks[mood] || [];
              const trackPlaying = nowPlaying?.mood === mood ? currentTrack : null;
              const displayTrack = trackPlaying || playlist?.[0];

              return (
              <section key={mood} id={mood} className={cn('page', { active: activePage === mood })}>
                <div className="glass">
                  <div className="mood-page-layout">
                    <div className="mood-hero">
                      {displayTrack ? (
                        <div className="now-playing-card">
                          <Image className="player-cover" src={displayTrack.cover} alt={displayTrack.title} width={400} height={400} data-ai-hint="song cover" unoptimized={displayTrack.cover.startsWith('data:')} />
                          <div className="player-info">
                              <h3>{displayTrack.title}</h3>
                              <p>{displayTrack.artist}</p>
                          </div>
                          <div className="player-controls">
                              <button onClick={handlePrev}><SkipBack /></button>
                              <button onClick={handlePlayPause} className="play-main-btn">
                                  {(isPlaying && trackPlaying) ? <Pause size={32} /> : <Play size={32} />}
                              </button>
                              <button onClick={handleNext}><SkipForward /></button>
                          </div>
                          <div className="player-actions">
                              <button onClick={(e) => handleLike(e, { ...displayTrack, mood: mood, index: nowPlaying?.index ?? 0 })} className={cn('like-btn', { 'liked': isLiked(displayTrack) })}>
                                  <Heart size={24} />
                              </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="emoji">{def.emoji}</div>
                          <h2>{def.title}</h2>
                          <p>{def.subtitle}</p>
                        </>
                      )}
                    </div>
                    <div className="playlist-view">
                      <div className="playlist-header">
                        <h3>Playlist</h3>
                      </div>
                      <ScrollArea className="playlist-scroll-area">
                        <div className="playlist-list">
                          {playlist && playlist.map((track, index) => (
                            <div key={index} className={cn('playlist-list-item', { active: trackPlaying?.src === track.src })} onClick={() => openPlayer(mood, index)}>
                               <Image className="playlist-list-item-cover" src={track.cover} alt={`${track.title} cover`} width={48} height={48} data-ai-hint="song cover" unoptimized={track.cover.startsWith('data:')} />
                              <div className="playlist-list-item-info">
                                <div className="title">{track.title}</div>
                                <div className="artist">{track.artist}</div>
                              </div>
                              <button onClick={(e) => handleLike(e, { ...track, mood: mood, index: index })} className={cn('like-btn', { 'liked': isLiked(track) })}>
                                <Heart size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </section>
            )})}
          </main>
          
          <footer>
            <small>Made with ❤️ by Bouroju Akshay</small>
            <small><a href="mailto:23eg106b12@anurag.edu.in">23eg106b12@anurag.edu.in</a></small>
            <small>MoodyO — mood based audio UI demo</small>
          </footer>

          {nowPlaying && currentTrack && (
            <div className="player-dialog-overlay" style={{display:'none'}}>
                <div className="player-dialog glass">
                    <button onClick={closePlayer} className="player-close-btn"><X size={24} /></button>
                    <Image className="player-cover" src={currentTrack.cover} alt={currentTrack.title} width={400} height={400} data-ai-hint="song cover" unoptimized={currentTrack.cover.startsWith('data:')} />
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
                        <button onClick={(e) => handleLike(e, { ...currentTrack, mood: nowPlaying.mood, index: nowPlaying.index })} className={cn('like-btn', { 'liked': isLiked(currentTrack) })}>
                            <Heart size={24} />
                        </button>
                    </div>
                </div>
            </div>
          )}
          <audio ref={audioRef} src={currentTrack?.src} onEnded={handleSongEnd} />

          <Dialog open={isCustomMoodDialogOpen} onOpenChange={setIsCustomMoodDialogOpen}>
            <DialogContent className="sheet-content glass">
              <DialogHeader>
                <DialogTitle>Create a Custom Mood</DialogTitle>
                <DialogDescription>
                  Describe the vibe, and AI will generate a unique mood page for you.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateMood} className="flex flex-col gap-4">
                <Input 
                  name="name" 
                  placeholder="Mood Name (e.g., Cosmic Jazz)" 
                  required 
                  value={customMoodFormData.name}
                  onChange={(e) => setCustomMoodFormData({...customMoodFormData, name: e.target.value })}
                />
                  <div>
                  <div className="emoji-picker">
                    {['🎷', '📚', '🌧️', '🌲', '🚀', '👾'].map(emoji => (
                      <span 
                        key={emoji}
                        className={cn('emoji-option', { selected: customMoodFormData.emoji === emoji })}
                        onClick={() => setCustomMoodFormData({...customMoodFormData, emoji })}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <Input 
                    name="emoji" 
                    placeholder="Select an emoji from above or type one" 
                    required 
                    maxLength={2} 
                    value={customMoodFormData.emoji}
                    onChange={(e) => setCustomMoodFormData({...customMoodFormData, emoji: e.target.value })}
                  />
                </div>
                <Input 
                  name="description" 
                  placeholder="Description (e.g., Late night jazz in a space lounge)" 
                  required
                  value={customMoodFormData.description}
                  onChange={(e) => setCustomMoodFormData({...customMoodFormData, description: e.target.value })}
                />
                <Button type="submit" disabled={isGenerating || !isFormValid}>
                  {isGenerating ? <><Loader className="animate-spin mr-2" size={16}/> Generating...</> : "Generate Mood"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
