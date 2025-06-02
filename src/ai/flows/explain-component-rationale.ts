// src/ai/flows/explain-component-rationale.ts
'use server';

/**
 * @fileOverview Explains the rationale behind selected components in the architecture diagram.
 *
 * - explainComponentRationale - A function that handles the component rationale explanation process.
 * - ExplainComponentRationaleInput - The input type for the explainComponentRationale function.
 * - ExplainComponentRationaleOutput - The return type for the explainComponentRationale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainComponentRationaleInputSchema = z.object({
  architectureDiagramDescription: z
    .string()
    .describe('A description of the architecture diagram.'),
  component: z.string().describe('The specific component to explain.'),
});
export type ExplainComponentRationaleInput = z.infer<
  typeof ExplainComponentRationaleInputSchema
>;

const ExplainComponentRationaleOutputSchema = z.object({
  rationale: z.string().describe('The explanation of why the component was chosen.'),
});
export type ExplainComponentRationaleOutput = z.infer<
  typeof ExplainComponentRationaleOutputSchema
>;

export async function explainComponentRationale(
  input: ExplainComponentRationaleInput
): Promise<ExplainComponentRationaleOutput> {
  return explainComponentRationaleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainComponentRationalePrompt',
  input: {schema: ExplainComponentRationaleInputSchema},
  output: {schema: ExplainComponentRationaleOutputSchema},
  prompt: `You are an expert system architect. Given a description of an architecture diagram and a specific component, explain the rationale behind the selection of that component in the architecture.

Architecture Diagram Description: {{{architectureDiagramDescription}}}
Component: {{{component}}}

Explain the rationale in a concise and informative manner. Focus on the benefits, suitability for the described architecture, and potential alternatives.`,
});

const explainComponentRationaleFlow = ai.defineFlow(
  {
    name: 'explainComponentRationaleFlow',
    inputSchema: ExplainComponentRationaleInputSchema,
    outputSchema: ExplainComponentRationaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
