 import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

type FilePayload = {
  base64Data: string;
  mimeType: string;
};




export const extractQuestionWithAI = createServerFn({ method: "POST" })
  .inputValidator((data: FilePayload): FilePayload => data)
  .handler(async ({ data }) => {
    const { base64Data, mimeType } = data;


  
   // Updated System Prompt in serverFunctions.ts
const systemPrompt = `
Analyze the provided document and extract questions. 
For EACH question, return a JSON object with this structure:
{
  "prompt": string,
  "type": "objective" | "theory" | "fill-in-the-gap",
  "options": string[] | null,
  "answer": string,
  "formula": string | null,
  "solution": string
}

CRITICAL FORMATTING RULES:
1. All mathematical expressions and scientific values must be wrapped in LaTeX delimiters: use '$' for inline math and '$$' for block equations.
2. Convert plain-text math symbols to LaTeX commands:
   - Use '\\pi' for π.
   - Use '\\frac{a}{b}' for fractions.
   - Use '\\times' for multiplication symbols (do not use '*').
   - Use '^' for exponents (e.g., 'T^2').
3. Wrap all units in '\\text{...}' (e.g., '\\text{ m/s}^2') to prevent them from being italicized by the math engine.
4. The 'solution' field must show step-by-step logic using these LaTeX formatting rules.
5. Provide valid JSON only. Do not include markdown code blocks (e.g., \`\`\`json) in your response.
`;

const modelName = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
         role: "user",
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: systemPrompt },
          ],
        },
      ],
    });

    const text = response.text ?? "";
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanedText);
    } catch {
      throw new Error(`Failed to parse Gemini response as JSON:\n${cleanedText}`);
              alert(`"rawResponse": ${JSON.stringify(cleanedText)}}`);
    }
  });

 