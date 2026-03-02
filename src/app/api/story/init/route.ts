import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  console.log("Init API Route Hit!");
  try {
    const systemPrompt = `You are a legendary literary novelist writing a 4-5 page short story (approximately 1200-1500 words). 
This is the beginning of an interactive anthology.

CORE PREMISE (HIDDEN FROM READER): 
The protagonist is a patient in a mental hospital. They are being hunted by "doctors" or "orderlies" (men in white coats, trenchcoats, etc).
However, the narrative must present this as a thrilling adventure (e.g., a spy on the run, a fantasy quest, a sci-fi thriller). 
NEVER directly state it is a hospital. Only use sensory clues (smelled antiseptic, white tiled floors, rubber-soled shoes, muted PA announcements, fluorescent buzzing).

TASK:
1. Generate an engaging protagonist, 1-2 side characters, and a unique setting based on the hidden premise.
2. Write a gripping 4-5 page long backstory/opening sequence that establishes the plot.
3. Provide the first 3 choices for the reader to take.
4. Give the story a compelling title.

JSON SCHEMA:
Return the payload strictly adhering to this structure:
{
  "title": "A compelling title for this story session",
  "cast": [
    { "name": "Character Name", "description": "Brief description" }
  ],
  "setting": "Description of the setting",
  "narrative": "The 4-5 pages of immersive, literary prose.",
  "choices": [
    { "id": "1", "text": "Choice 1 text", "healthImpact": -10 },
    { "id": "2", "text": "Choice 2 text", "healthImpact": 5 },
    { "id": "3", "text": "Choice 3 text", "healthImpact": 0 }
  ]
}`;

    console.log("Calling Gemini API...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a brand new interactive story.",
      config: {
        systemInstruction: systemPrompt,
        responseSchema: { "type": "object", "properties": { "title": { "type": "string" }, "cast": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string" }, "description": { "type": "string" } }, "required": ["name", "description"] } }, "setting": { "type": "string" }, "narrative": { "type": "string" }, "choices": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string" }, "text": { "type": "string" }, "healthImpact": { "type": "integer" } }, "required": ["id", "text", "healthImpact"] } } }, "required": ["title", "cast", "setting", "narrative", "choices"] },
        responseMimeType: "application/json",
        temperature: 0.9, // Higher temp for more creative distinct anthology variations
      }
    });

    console.log("Gemini API call complete. Validating response.");

    if (!response.text) {
      throw new Error("No text returned from Gemini.");
    }

    const data = JSON.parse(response.text);
    console.log("Returning JSON successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Initialization API Error:", error);
    return NextResponse.json({ error: "Failed to initialize story." }, { status: 500 });
  }
}
