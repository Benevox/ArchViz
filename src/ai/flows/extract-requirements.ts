// This is an AI-generated file. Do not edit by hand.
'use server';

/**
 * @fileOverview Extracts architectural requirements from a file.
 *
 * - extractRequirementsFromFile - A function that handles the extraction of architectural requirements from a file.
 * - ExtractRequirementsFromFileInput - The input type for the extractRequirementsFromFile function.
 * - ExtractRequirementsFromFileOutput - The return type for the extractRequirementsFromFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRequirementsFromFileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file containing architectural requirements, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractRequirementsFromFileInput = z.infer<typeof ExtractRequirementsFromFileInputSchema>;

const ExtractRequirementsFromFileOutputSchema = z.object({
  extractedRequirements: z
    .string()
    .describe('The extracted and interpreted architectural requirements from the file.'),
});
export type ExtractRequirementsFromFileOutput = z.infer<typeof ExtractRequirementsFromFileOutputSchema>;

export async function extractRequirementsFromFile(input: ExtractRequirementsFromFileInput): Promise<ExtractRequirementsFromFileOutput> {
  return extractRequirementsFromFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractRequirementsFromFilePrompt',
  input: {schema: ExtractRequirementsFromFileInputSchema},
  output: {schema: ExtractRequirementsFromFileOutputSchema},
  prompt: `You are an expert architect specializing in extracting architectural requirements from files.

You will use the information in the file to identify the architectural requirements.

Interpret the file content and extract the requirements.

File: {{media url=fileDataUri}}`,
});

const extractRequirementsFromFileFlow = ai.defineFlow(
  {
    name: 'extractRequirementsFromFileFlow',
    inputSchema: ExtractRequirementsFromFileInputSchema,
    outputSchema: ExtractRequirementsFromFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
