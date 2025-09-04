'use server';

/**
 * @fileOverview An AI agent that generates a custom music playlist based on a user-selected mood.
 *
 * - generateMoodPlaylist - A function that generates a mood-based playlist.
 * - GenerateMoodPlaylistInput - The input type for the generateMoodPlaylist function.
 * - GenerateMoodPlaylistOutput - The return type for the generateMoodPlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SongSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});

const GenerateMoodPlaylistInputSchema = z.object({
  mood: z.string().describe('The mood for which to generate the playlist.'),
  playlistLength: z
    .number()
    .default(10)
    .describe('The desired length of the playlist.'),
});
export type GenerateMoodPlaylistInput = z.infer<typeof GenerateMoodPlaylistInputSchema>;

const GenerateMoodPlaylistOutputSchema = z.object({
  playlist: z.array(SongSchema).describe('A list of song recommendations for the specified mood.'),
});
export type GenerateMoodPlaylistOutput = z.infer<typeof GenerateMoodPlaylistOutputSchema>;

export async function generateMoodPlaylist(
  input: GenerateMoodPlaylistInput
): Promise<GenerateMoodPlaylistOutput> {
  return generateMoodPlaylistFlow(input);
}

const generateMoodPlaylistFlow = ai.defineFlow(
  {
    name: 'generateMoodPlaylistFlow',
    inputSchema: GenerateMoodPlaylistInputSchema,
    outputSchema: GenerateMoodPlaylistOutputSchema,
  },
  async (input: GenerateMoodPlaylistInput) => {
    let retries = 3;
    while (retries > 0) {
      try {
        const {text} = await ai.generate({
          prompt: `Generate a playlist of ${input.playlistLength} songs for the mood "${input.mood}".
          Return a comma-separated list of songs and artists in the format: "Song Title 1 by Artist 1, Song Title 2 by Artist 2, ..."
          Do not include any other text, just the list.`,
        });

        if (text) {
          const songs = text
            .split(',')
            .map(song => {
              const [title, artist] = song.trim().split(' by ');
              return {title: title?.trim(), artist: artist?.trim()};
            })
            .filter(song => song.title && song.artist);
            
          if (songs.length > 0) {
            return {playlist: songs};
          }
        }
      } catch (error) {
        console.warn('Playlist generation attempt failed, retrying...', error);
      }
      retries--;
    }
    
    // If all retries fail, throw an error.
    throw new Error('Failed to generate playlist after multiple retries.');
  }
);