import { GoogleGenAI } from '@google/genai';

// Initialize the API client. It will automatically use process.env.GEMINI_API_KEY
// Note: GenAI SDK must be used server-side to avoid leaking the API key.
// We will call this from Next.js API Routes (Serverless Functions)
const ai = new GoogleGenAI({});

export async function generateStorySegment(
    cast: { name: string, description: string }[],
    setting: string,
    hiddenHealth: number,
    storyHistory: string[],
    actionTaken: string
) {
    const isFrantic = hiddenHealth < 20;

    const castList = cast.map(c => `- ${c.name}: ${c.description}`).join('\n');

    const systemPrompt = `You are a legendary literary novelist writing a psychological thriller anthology. 
SESSION CONTEXT:
Cast of Characters:
${castList}

Setting: ${setting}

Current Hidden Health/Sanity Score: [${hiddenHealth}/100]. 
Context History (Recent Events): ${storyHistory.slice(-5).join("\n")}
Recent Action Taken by user: ${actionTaken}

Task: Generate about 12-15 paragraphs (approx 800-1000 words) of immersive, literary prose narrating the outcome of the user's action and advancing the plot significantly before presenting the next decision point. Then, provide exactly 3 distinct choices for the user's next action.

CRITICAL INSTRUCTIONS:
1. The protagonist is actually a mental patient and the "Men in Trenchcoats" hunting him are doctors/orderlies.
2. NEVER reveal the mental hospital twist directly. Only hint at it through sensory clues (smell of antiseptic, white tiles, rubber-soled shoes, muted PA announcements, etc.).
3. If Health < 20 (${isFrantic ? 'YES' : 'NO'}), make the prose significantly more frantic, paranoid, and distorted.
4. Output must be in JSON format to be easily parsed by the frontend.

JSON Schema:
{
  "narrative": "The prose describing what happens.",
  "choices": [
    { "id": "1", "text": "Choice 1 text", "healthImpact": -10 },
    { "id": "2", "text": "Choice 2 text", "healthImpact": 5 },
    { "id": "3", "text": "Choice 3 text", "healthImpact": 0 }
  ]
}

Ensure the "healthImpact" represents how this choice affects their sanity (- negatively, + positively). Don't make it too obvious.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Continue the story based on the action provided.",
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        });

        if (!response.text) {
            throw new Error("No text returned from Gemini.");
        }

        const data = JSON.parse(response.text);
        return data;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate story segment.");
    }
}
