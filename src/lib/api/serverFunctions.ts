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
  "answer": string, // Correct answer or fill-in-the-gap word
  "formula": string | null,
  "solution": string // Step-by-step explanation
}
Return a JSON array of these objects. Provide valid JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
    }
  });