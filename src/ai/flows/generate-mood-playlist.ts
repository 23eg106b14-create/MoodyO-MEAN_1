
'use server';
/**
 * @fileOverview A flow for generating mood-based playlists.
 *
 * - generateMoodPlaylist - A function that generates a playlist for a given mood.
 * - MoodPlaylistParams - The input type for the generateMoodPlaylist function.
 * - MoodPlaylist - The return type for the generateMoodPlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MoodPlaylistParamsSchema = z.string();
export type MoodPlaylistParams = z.infer<typeof MoodPlaylistParamsSchema>;

export const SongSchema = z.object({
    title: z.string().describe('The title of the song.'),
    artist: z.string().describe('The artist of the song.'),
});

export const MoodPlaylistSchema = z.object({
    songs: z.array(SongSchema).describe('A list of 10 songs for the given mood.'),
});

export type MoodPlaylist = z.infer<typeof MoodPlaylistSchema>;


export async function generateMoodPlaylist(mood: MoodPlaylistParams): Promise<MoodPlaylist> {
    return generateMoodPlaylistFlow(mood);
}

const prompt = ai.definePrompt({
    name: 'generateMoodPlaylistPrompt',
    input: {schema: MoodPlaylistParamsSchema},
    output: {schema: MoodPlaylistSchema},
    prompt: `You are a music curator. Generate a list of 10 songs for the mood: {{{input}}}.
    
    Return the list of songs in the requested JSON format.
    `,
});

const generateMoodPlaylistFlow = ai.defineFlow(
    {
        name: 'generateMoodPlaylistFlow',
        inputSchema: MoodPlaylistParamsSchema,
        outputSchema: MoodPlaylistSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
