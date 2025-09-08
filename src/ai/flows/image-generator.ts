'use server';
/**
 * @fileOverview An AI flow for generating images.
 *
 * This file defines the AI flow for generating images based on a text prompt. It includes:
 * - The main `generateImage` function that handles the image generation process.
 * - Input and output schemas (GenerateImageInput, GenerateImageOutput) for type safety.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Album cover art for a song. Cinematic, high-quality, photographic. Style hint: ${input.prompt}`,
    });

    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Failed to generate image.');
    }
    
    return { imageUrl };
  }
);
