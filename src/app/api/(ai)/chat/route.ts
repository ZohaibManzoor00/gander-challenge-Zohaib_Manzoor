import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import { getAllFlightDataForAI } from "@/db/actions/ai-actions";
import { getUserFromRequest } from "@/lib/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const user = getUserFromRequest(req);
    if (!user || user.role != "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const LIMIT_FOR_TOKEN_SAFETY = 20;
    const flights = await getAllFlightDataForAI();
    const context = JSON.stringify(
      flights.slice(0, LIMIT_FOR_TOKEN_SAFETY),
      null,
      2
    );

    const currentDateTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York", // get dynamically from the user in the future
      dateStyle: "full",
      timeStyle: "short",
    });

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI assistant helping a charter flight administrator understand upcoming flight schedules, aircraft availability, and operational logistics.
                   The current local date and time is: ${currentDateTime}
                   Based on the following flight data in JSON format:
                   ${context}
                   Answer the user's question below clearly and concisely, using relevant dates and times from the data:
                   "${prompt}"
                   Only include information grounded in the JSON data. If the answer depends on specific time zones or scheduling details, mention them.`,
            },
          ],
        },
      ],
    });

    const firstText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ text: firstText });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
