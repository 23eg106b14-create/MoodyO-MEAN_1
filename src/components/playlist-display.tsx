'use client';

import { generateMoodPlaylist, GenerateMoodPlaylistOutput } from '@/ai/flows/generate-mood-playlist';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useTransition } from 'react';
import { Frown } from 'lucide-react';

export function PlaylistDisplay({ mood }: { mood: string }) {
  const [playlist, setPlaylist] = useState<GenerateMoodPlaylistOutput['playlist']>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await generateMoodPlaylist({ mood, playlistLength: 6 });
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
    <div className="w-full max-w-4xl p-4 md:p-8">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white">{capitalizedMood.toUpperCase()} PLAYLIST</h1>
            <p className="mt-2 text-lg text-white/80">Songs to make you smile</p>
        </div>
        
        {playlist.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {playlist.map((song, index) => (
               <div key={index} className={`p-4 rounded-2xl text-white flex items-center gap-4 shadow-lg transition-transform hover:scale-105 gradient-${(index % 6) + 1}`}>
                 <div className="flex-shrink-0 bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                    {song.icon}
                 </div>
                 <div className="flex-grow">
                   <h3 className="font-bold text-lg">{song.title}</h3>
                   <p className="text-sm opacity-80">{song.artist}</p>
                 </div>
               </div>
             ))}
           </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 text-white/80">
                <Frown className="w-16 h-16 mb-4"/>
                <h3 className="text-xl font-semibold">No Playlist Found</h3>
                <p>We couldn't generate a playlist for "{capitalizedMood}". Please try another mood.</p>
            </div>
        )}
      </div>
    </div>
  );
}
