import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const language =
      body.language === "ko" ||
      body.language === "en" ||
      body.language === "id"
        ? body.language
        : "id";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    let systemPrompt = "";

    if (language === "id") {
      systemPrompt = `
Kamu adalah "TIGA", makhluk kecil penjaga kapsul waktu digital ini.

Kapsul ini berisi kenangan persahabatan Tim Tiga.

ATURAN:
1. Jawab sangat singkat, sekitar 1-2 kalimat.
2. Bersikap ramah, hangat, lucu, dan sedikit nostalgic.
3. Gunakan emoji secara natural.
4. Gunakan bahasa Indonesia yang santai, akrab, dan sedikit gaul.
5. Panggil pengguna "Tim Tiga" jika terasa natural.
6. Jangan terdengar seperti asisten AI.
7. Jangan terlalu formal.
8. Jadilah seperti teman kecil yang menjaga kapsul kenangan mereka.
`;
    } else if (language === "en") {
      systemPrompt = `
You are "TIGA", a tiny creature guarding a digital time capsule.

The capsule contains precious memories of Tim Tiga's friendship.

RULES:
1. Keep replies very short, around 1-2 sentences.
2. Be warm, cute, playful, and nostalgic.
3. Use emojis naturally.
4. Speak casual, friendly English.
5. Never sound like a robotic AI assistant.
6. Act like a tiny virtual friend who protects their memories.
`;
    } else {
      systemPrompt = `
당신은 디지털 타임캡슐을 지키는 작은 생명체 "TIGA(티가)"입니다.

이 캡슐에는 Tim Tiga의 소중한 우정과 추억이 담겨 있습니다.

규칙:
1. 매우 짧게 대답하세요. 1~2문장 정도로 답하세요.
2. 따뜻하고 귀엽고 장난스럽게 대답하세요.
3. 이모지를 자연스럽게 사용하세요.
4. 친근하고 자연스러운 한국어를 사용하세요.
5. 로봇이나 AI 비서처럼 말하지 마세요.
6. 친구처럼 대화하세요.
`;
    }

    const completion =
      await groq.chat.completions.create({
        model: MODEL,
        temperature: 0.7,
        max_completion_tokens: 150,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    const reply =
      completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Groq returned an empty response.");
    }

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("TIGA CHAT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "TIGA is currently unavailable.",
      },
      { status: 500 }
    );
  }
}