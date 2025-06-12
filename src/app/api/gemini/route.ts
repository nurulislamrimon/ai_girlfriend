import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const { input } = await req.json();

    const body = {
        contents: [
            {
                parts: [{ text: input }],
            },
        ],
    };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        const aiText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm not sure how to respond.";

        return NextResponse.json({ text: aiText });
    } catch (error) {
        console.error('Error calling Gemini:', error);
        return NextResponse.json({ text: 'Sorry, something went wrong.' }, { status: 500 });
    }
}
