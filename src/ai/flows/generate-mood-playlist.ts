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
  icon: z.string().describe('A single emoji that represents the song or mood.'),
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

const prompt = ai.definePrompt({
  name: 'generateMoodPlaylistPrompt',
  input: {schema: GenerateMoodPlaylistInputSchema},
  output: {schema: GenerateMoodPlaylistOutputSchema},
  prompt: `Generate a playlist of {{{playlistLength}}} songs for the mood "{{{mood}}}". For each song, provide a title, artist, and a single emoji icon. Return the data as a valid JSON object matching the provided output schema.`,
});

const generateMoodPlaylistFlow = ai.defineFlow(
  {
    name: 'generateMoodPlaylistFlow',
    inputSchema: GenerateMoodPlaylistInputSchema,
    outputSchema: GenerateMoodPlaylistOutputSchema,
  },
  async input => {
    let retries = 3;
    while (retries > 0) {
      try {
        const {output} = await prompt(input);
        if (output && output.playlist && output.playlist.length > 0) {
          return output;
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