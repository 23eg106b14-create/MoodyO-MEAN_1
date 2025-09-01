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

const GenerateMoodPlaylistInputSchema = z.object({
  mood: z.string().describe('The mood for which to generate the playlist.'),
  playlistLength: z
    .number()
    .default(10)
    .describe('The desired length of the playlist.'),
});
export type GenerateMoodPlaylistInput = z.infer<typeof GenerateMoodPlaylistInputSchema>;

const GenerateMoodPlaylistOutputSchema = z.object({
  playlist: z.array(z.string()).describe('A list of song recommendations for the specified mood. Each element is a song title.'),
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
  prompt: `You are a world-class music curator. A user is feeling "{{{mood}}}" and wants you to generate a playlist of {{{playlistLength}}} songs to match that mood. Include a mix of popular and lesser-known songs. Return your response as a JSON object with a "playlist" field containing an array of song titles. Do not include artist names or numbering.`,
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
    
    // If all retries fail, return an empty playlist.
    return { playlist: [] };
  }
);
