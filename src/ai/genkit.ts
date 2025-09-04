/**
 * @fileoverview This file initializes the Genkit AI plugin and exports the `ai` object.
 *
 * It is used by all other files that interact with Genkit.
 */
import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {nextPlugin} from '@genkit-ai/next';

import * as z from 'zod';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    nextPlugin({
      // We are mounting the API under the /api/genkit route.
      // You can change this to anything you want.
      route: '/api/genkit',
    }),
  ],
});
