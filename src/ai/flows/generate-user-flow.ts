// use server'

/**
 * @fileOverview Generates a user flow explanation based on an architecture diagram.
 *
 * - generateUserFlow - A function that generates the user flow explanation.
 * - GenerateUserFlowInput - The input type for the generateUserFlow function.
 * - GenerateUserFlowOutput - The return type for the generateUserFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUserFlowInputSchema = z.object({
  architectureDiagram: z
    .string()
    .describe('A description of the architecture diagram.'),
});
export type GenerateUserFlowInput = z.infer<typeof GenerateUserFlowInputSchema>;

const GenerateUserFlowOutputSchema = z.object({
  userFlowExplanation: z.string().describe('The explanation of the user flow.'),
});
export type GenerateUserFlowOutput = z.infer<typeof GenerateUserFlowOutputSchema>;

export async function generateUserFlow(input: GenerateUserFlowInput): Promise<GenerateUserFlowOutput> {
  return generateUserFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUserFlowPrompt',
  input: {schema: GenerateUserFlowInputSchema},
  output: {schema: GenerateUserFlowOutputSchema},
  prompt: `You are an expert in designing and explaining user flows for complex systems.

  Based on the following architecture diagram description, generate a detailed user flow explanation.

  Architecture Diagram Description: {{{architectureDiagram}}}
  `,
});

const generateUserFlowFlow = ai.defineFlow(
  {
    name: 'generateUserFlowFlow',
    inputSchema: GenerateUserFlowInputSchema,
    outputSchema: GenerateUserFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
