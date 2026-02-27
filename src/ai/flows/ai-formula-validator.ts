'use server';
/**
 * @fileOverview An AI assistant for creating and validating calculation formulas for aluminum sections.
 *
 * - aiFormulaValidator - A function that handles the generation or validation of formulas.
 * - AiFormulaValidatorInput - The input type for the aiFormulaValidator function.
 * - AiFormulaValidatorOutput - The return type for the aiFormulaValidator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiFormulaValidatorInputSchema = z.object({
  formulaDescription: z.string().optional().describe('A natural language description of the formula to be created. Provide this if you want the AI to generate a formula.'),
  formulaToValidate: z.string().optional().describe('A mathematical formula string to be validated. Provide this if you want the AI to check an existing formula.'),
  contextVariables: z.array(z.string()).optional().describe('A list of variables available for use in the formulas (e.g., Width, Height, Qty, count, weight_per_ft).')
}).describe('Input for the AI formula validator, requiring either a description for generation or a formula for validation.');
export type AiFormulaValidatorInput = z.infer<typeof AiFormulaValidatorInputSchema>;

const AiFormulaValidatorOutputSchema = z.object({
  generatedFormula: z.string().optional().describe('The mathematical formula generated from the description, if a formulaDescription was provided.'),
  isValid: z.boolean().optional().describe('True if the provided formula is valid and accurate, false otherwise, if a formulaToValidate was provided.'),
  validationFeedback: z.string().optional().describe('Detailed feedback on the formula validation, including errors or suggestions, if a formulaToValidate was provided.'),
  correctedFormula: z.string().optional().describe('A corrected version of the formula if it was invalid, if a formulaToValidate was provided.')
}).describe('Output from the AI formula validator, containing either a generated formula or validation results.');
export type AiFormulaValidatorOutput = z.infer<typeof AiFormulaValidatorOutputSchema>;

export async function aiFormulaValidator(input: AiFormulaValidatorInput): Promise<AiFormulaValidatorOutput> {
  return aiFormulaValidatorFlow(input);
}

const aiFormulaPrompt = ai.definePrompt({
  name: 'aiFormulaPrompt',
  input: {schema: AiFormulaValidatorInputSchema},
  output: {schema: AiFormulaValidatorOutputSchema},
  prompt: `You are an AI assistant specialized in generating and validating calculation formulas for aluminum sections.
The formulas should only use basic arithmetic operations (+, -, *, /) and parentheses.
Available context variables: {{#if contextVariables}}{{{contextVariables}}}{{else}}None provided.{{/if}}

{{#if formulaDescription}}
  Your task is to generate a mathematical formula based on the following natural language description.
  Description: "{{{formulaDescription}}}"
  Please output the generated formula in the \`generatedFormula\` field.
{{else if formulaToValidate}}
  Your task is to validate the following mathematical formula for syntax, potential errors, and logical consistency within the context of aluminum section calculations.
  Formula to validate: "{{{formulaToValidate}}}"
  Please set \`isValid\` to true if the formula is correct and robust, otherwise set it to false. Provide detailed \`validationFeedback\` and, if invalid, suggest a \`correctedFormula\`.
{{else}}
  Please provide either a \`formulaDescription\` to generate a formula or a \`formulaToValidate\` to validate an existing one. If neither is provided, I cannot assist.
{{/if}}`
});

const aiFormulaValidatorFlow = ai.defineFlow(
  {
    name: 'aiFormulaValidatorFlow',
    inputSchema: AiFormulaValidatorInputSchema,
    outputSchema: AiFormulaValidatorOutputSchema
  },
  async (input) => {
    if (!input.formulaDescription && !input.formulaToValidate) {
      throw new Error('Either formulaDescription or formulaToValidate must be provided.');
    }

    const {output} = await aiFormulaPrompt(input);
    return output!;
  }
);
