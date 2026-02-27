'use server';
/**
 * @fileOverview An AI assistant that suggests efficient cutting patterns for aluminum sections.
 *
 * - suggestCuttingPatterns - A function that orchestrates the cutting pattern suggestion process.
 * - CuttingPatternInput - The input type for the suggestCuttingPatterns function.
 * - CuttingPatternOutput - The return type for the suggestCuttingPatterns function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CuttingPatternInputSchema = z.object({
  requiredCuts: z
    .array(
      z.object({
        length: z.number().describe('The length of the piece to be cut.'),
        quantity: z.number().describe('The number of pieces of this length needed.'),
      })
    )
    .describe('A list of all required linear cuts, grouped by length and total quantity.'),
  stockLengths: z.array(z.number()).describe('An array of available standard stock lengths for cutting.'),
});
export type CuttingPatternInput = z.infer<typeof CuttingPatternInputSchema>;

const CuttingPatternOutputSchema = z.object({
  cuttingPatterns: z
    .array(
      z.object({
        stockLengthUsed: z.number().describe('The length of the stock piece from which cuts are made.'),
        cutsMade: z
          .array(
            z.object({
              cutLength: z.number().describe('The length of an individual piece cut from this stock.'),
              quantity: z.number().describe('The number of pieces of this specific length cut from this stock piece.'),
            })
          )
          .describe('A list of pieces cut from this specific stock length.'),
        waste: z.number().describe('The remaining waste length from this stock piece after all cuts.'),
        comment: z.string().optional().describe('Any additional notes or rationale for this specific cutting pattern.'),
      })
    )
    .describe('A detailed plan for cutting patterns from available stock lengths.'),
  overallEfficiencyMessage: z.string().describe('A summary message describing the overall efficiency and total waste across all patterns.'),
});
export type CuttingPatternOutput = z.infer<typeof CuttingPatternOutputSchema>;

export async function suggestCuttingPatterns(input: CuttingPatternInput): Promise<CuttingPatternOutput> {
  return cuttingPatternSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cuttingPatternPrompt',
  input: { schema: CuttingPatternInputSchema },
  output: { schema: CuttingPatternOutputSchema },
  prompt: `You are an expert in optimizing aluminum cutting patterns. Your goal is to minimize material waste.

Given the following required linear cuts and available stock lengths, generate the most efficient cutting patterns.

Required Cuts:
{{#each requiredCuts}}
- Length: {{this.length}} units, Quantity: {{this.quantity}}
{{/each}}

Available Stock Lengths: {{stockLengths}}

Provide a plan for each stock length used, detailing which cuts are made from it and the resulting waste. Also, give an overall summary of the efficiency. Ensure the sum of cut lengths plus waste for each stock length equals the stock length used. Use all required cuts.

Think step by step and present the most optimal solution. The output must strictly adhere to the CuttingPatternOutputSchema. Do not include any text outside the JSON block.`,
});

const cuttingPatternSuggesterFlow = ai.defineFlow(
  {
    name: 'cuttingPatternSuggesterFlow',
    inputSchema: CuttingPatternInputSchema,
    outputSchema: CuttingPatternOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
