// src/ai/flows/generate-diagram.ts
'use server';

/**
 * @fileOverview Generates an architectural diagram from a natural language description.
 *
 * - generateDiagram - A function that generates an architectural diagram based on a description.
 * - GenerateDiagramInput - The input type for the generateDiagram function.
 * - GenerateDiagramOutput - The return type for the generateDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagramInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A natural language description of the desired architecture.'
    ),
});

export type GenerateDiagramInput = z.infer<typeof GenerateDiagramInputSchema>;

const GenerateDiagramOutputSchema = z.object({
  diagram: z
    .string()
    .describe(
      'The generated architectural diagram in a suitable format (e.g., Mermaid, PlantUML, JSON).' // Specify format here
    ),
});

export type GenerateDiagramOutput = z.infer<typeof GenerateDiagramOutputSchema>;

export async function generateDiagram(
  input: GenerateDiagramInput
): Promise<GenerateDiagramOutput> {
  return generateDiagramFlow(input);
}

const generateDiagramPrompt = ai.definePrompt({
  name: 'generateDiagramPrompt',
  input: {schema: GenerateDiagramInputSchema},
  output: {schema: GenerateDiagramOutputSchema},
  prompt: `You are an AI architect that will generate an architectural diagram based on user provided description.

  The diagram should be represented in Mermaid syntax.

  Description: {{{description}}}
  Diagram:`, // Request Mermaid syntax
});

const generateDiagramFlow = ai.defineFlow(
  {
    name: 'generateDiagramFlow',
    inputSchema: GenerateDiagramInputSchema,
    outputSchema: GenerateDiagramOutputSchema,
  },
  async input => {
    const {output} = await generateDiagramPrompt(input);
    return output!;
  }
);
