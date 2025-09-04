'use client';

import { generateMoodPlaylist, GenerateMoodPlaylistOutput } from '@/ai/flows/generate-mood-playlist';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useTransition } from 'react';
import { Frown, Music2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function PlaylistDisplay({ mood }: { mood: string }) {
  const [playlist, setPlaylist] = useState<GenerateMoodPlaylistOutput['playlist']>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
    return null;
  }
  
  return (
    <div className="w-full max-w-2xl p-4 md:p-8">
      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">{capitalizedMood} Playlist</CardTitle>
          <CardDescription>A selection of songs for when you're feeling {mood}.</CardDescription>
        </CardHeader>
        <CardContent>
          {playlist.length > 0 ? (
            <div className="space-y-4">
              {playlist.map((song, index) => (
                <div key={index}>
                  <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="text-muted-foreground">
                      <Music2 className="w-5 h-5"/>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{song.title}</h3>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  {index < playlist.length - 1 && <Separator />}
                </div>
              ))}
            </div>
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
  );
}
