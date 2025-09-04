/**
 * @fileOverview This file contains the type definitions and Zod schemas for the AI flows.
 */

import {z} from 'zod';

export const MoodPlaylistParamsSchema = z.string();
export type MoodPlaylistParams = z.infer<typeof MoodPlaylistParamsSchema>;

export const SongSchema = z.object({
    title: z.string().describe('The title of the song.'),
    artist: z.string().describe('The artist of the song.'),
});
export type Song = z.infer<typeof SongSchema>;

export const MoodPlaylistSchema = z.object({
    songs: z.array(SongSchema).describe('A list of 10 songs for the given mood.'),
});
export type MoodPlaylist = z.infer<typeof MoodPlaylistSchema>;
