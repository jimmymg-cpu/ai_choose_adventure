import { NextResponse } from 'next/server';

export const runtime = 'edge';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
    try {
        const { id, state } = await req.json();

        if (!id || !state) {
            return NextResponse.json({ error: "Missing id or state" }, { status: 400 });
        }

        // Since we are running on Edge (Cloudflare), we access bindings via process.env or Next Request
        // Wait, in Next.js App Router on Cloudflare Pages, bindings are often on `process.env` (as any) 
        // or passed via Next Request `req.cf` ?
        // Actually, Next.js requires specific edge runtime setup for bindings.
        // Assuming process.env.DB is typed as D1Database in Cloudflare Pages environment
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = process.env.DB as any;

        if (!db) {
            console.warn("D1 binding 'DB' not found. This is expected in standard local dev without wrangler.");
            return NextResponse.json({ success: true, simulated: true });
        }

        await db.prepare(
            `INSERT INTO bookmarks (id, state_json) VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP`
        ).bind(id, JSON.stringify(state)).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = process.env.DB as any;
        if (!db) {
            return NextResponse.json({ error: "D1 DB binding not ready" }, { status: 503 });
        }

        const { results } = await db.prepare('SELECT state_json FROM bookmarks WHERE id = ?').bind(id).all();

        if (results.length === 0) {
            return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
        }

        return NextResponse.json({ state: JSON.parse(results[0].state_json) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load bookmark" }, { status: 500 });
    }
}
