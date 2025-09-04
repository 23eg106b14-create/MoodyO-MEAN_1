
'use server';
/**
 * @fileOverview A flow for generating mood-based playlists.
 *
 * - generateMoodPlaylist - A function that generates a playlist for a given mood.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MoodPlaylistParams, MoodPlaylistParamsSchema, MoodPlaylist, MoodPlaylistSchema } from '@/ai/types';


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
