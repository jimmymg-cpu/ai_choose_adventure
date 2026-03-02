import { generateStorySegment } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cast, setting, hiddenHealth, storyHistory, actionTaken } = body;

        // Some basic validation
        if (!cast || cast.length === 0) {
            return NextResponse.json({ error: "Missing cast context" }, { status: 400 });
        }

        const result = await generateStorySegment(cast, setting, hiddenHealth, storyHistory || [], actionTaken || "Continue the story");
        return NextResponse.json(result);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Failed to generate story segment." }, { status: 500 });
    }
}
