'use client';

import { generateMoodPlaylist } from '@/ai/flows/generate-mood-playlist';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Frown, ListMusic, Music2 } from 'lucide-react';

export function PlaylistDisplay({ mood }: { mood: string }) {
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    document.body.setAttribute('data-mood', mood.toLowerCase());
    return () => {
      document.body.removeAttribute('data-mood');
    };
  }, [mood]);

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await generateMoodPlaylist({ mood, playlistLength: 10 });
        if (result.playlist && result.playlist.length > 0) {
          setPlaylist(result.playlist);
        } else {
            throw new Error('AI did not return a playlist.');
        }
      } catch (error) {
        console.error('Failed to generate playlist:', error);
        toast({
          variant: 'destructive',
          title: 'Error Generating Playlist',
          description: 'Could not generate a playlist for this mood. Please try another.',
        });
        setPlaylist([]);
      }
    });
  }, [mood, toast]);

  const capitalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1);

  if (isPending) {
    // The loading.tsx file will be shown
    return null;
  }
  
  return (
    <div className="relative w-full h-full min-h-[calc(100vh-12rem)] p-4 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-mood-color-start/20 via-background to-background transition-all duration-1000"></div>
      <div className="relative mx-auto max-w-2xl">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black">{capitalizedMood} Playlist</h1>
            <p className="mt-2 text-lg text-muted-foreground">A curated list of tracks to match your vibe.</p>
        </div>
        
        <Card className="bg-background/50 backdrop-blur-sm border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListMusic className="w-6 h-6 text-accent"/>
                Your Songs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {playlist.length > 0 ? (
                 <ul className="space-y-2">
                 {playlist.map((song, index) => (
                   <li key={index} className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:bg-white/5 hover:border-white/10 transition-colors duration-200">
                     <span className="text-sm font-medium text-accent">
                        <Music2 className="w-5 h-5"/>
                     </span>
                     <span className="text-base font-medium text-foreground/90">{song}</span>
                   </li>
                 ))}
               </ul>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                    <Frown className="w-16 h-16 mb-4"/>
                    <h3 className="text-xl font-semibold">No Playlist Found</h3>
                    <p>We couldn't generate a playlist for "{capitalizedMood}". Please try another mood.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
