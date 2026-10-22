import { NextResponse } from "next/server";
import { getAIClient, SYSTEM_PROMPT } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
try {
const body = await request.json();

const messages = body?.messages;

if (!Array.isArray(messages) || messages.length === 0) {
  return NextResponse.json(
    { error: "A conversation is required." },
    { status: 400 }
  );
}

if (messages.length > 30) {
  return NextResponse.json(
    { error: "Conversation is too long." },
    { status: 400 }
  );
}

const sanitizedMessages = messages.map((message) => {
  if (
    !message ||
    typeof message.content !== "string" ||
    !["user", "assistant"].includes(message.role)
  ) {
    throw new Error("Invalid message format.");
  }

  if (message.content.length > 12000) {
    throw new Error("Message is too long.");
  }

  return {
    role: message.role as "user" | "assistant",
    content: message.content
  };
});

const client = getAIClient();

const completion = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    ...sanitizedMessages
  ],
  temperature: 0.7,
  max_tokens: 1500
});

const answer =
  completion.choices[0]?.message?.content ||
  "I could not generate a response.";

return NextResponse.json({ answer });

} catch (error) {
console.error("AXION AI request failed:", error);

return NextResponse.json(
  { error: "Unable to process your request. Please try again." },
  { status: 500 }
);

}
  }
