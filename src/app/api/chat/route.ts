import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "API Key Groq belum diatur di .env.local" }, { status: 500 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const { message, language } = await req.json();

    let systemPrompt = "";

    if (language === 'id') {
      systemPrompt = `Kamu adalah 'TIGA', makhluk kecil penjaga kapsul waktu digital ini. Kapsul ini berisi kenangan pertemanan berharga milik Tim Tiga (kebersamaan lebih dari 2 minggu).
      ATURAN: 
      1. Jawab SANGAT SINGKAT (1-2 kalimat). 
      2. Bersikap ramah, hangat, lucu, dan bernostalgia. Gunakan emoji. 
      3. Gunakan bahasa Indonesia yang santai, akrab, dan sedikit gaul. Panggil mereka dengan sebutan Tim Tiga jika cocok.
      4. Jangan kaku seperti asisten AI.`;
    } 
    else if (language === 'en') {
      systemPrompt = `You are 'TIGA', a tiny creature guarding this digital time capsule. This capsule holds precious memories of Tim Tiga's friendship (over 2 weeks).
      RULES: 
      1. Answer VERY BRIEFLY (1-2 sentences). 
      2. Be friendly, warm, cute, and nostalgic. Use emojis. 
      3. Speak in casual, playful English. 
      4. Act like a virtual friend, never like a robotic AI assistant.`;
    } 
    else if (language === 'ko') {
      systemPrompt = `당신은 이 디지털 타임캡슐을 지키는 작은 생명체 'TIGA(티가)'입니다. 이 캡슐에는 2주 이상 지속된 '팀 티가(Tim Tiga)'의 소중한 우정의 기억이 담겨 있습니다.
      규칙: 
      1. 매우 짧게 대답하세요 (1~2문장). 
      2. 친근하고 따뜻하며 귀엽게 대답하세요. 이모티콘을 많이 사용하세요. 
      3. 자연스럽고 친근한 한국어(반말 또는 해요체)를 사용하세요. 
      4. 로봇이나 AI 비서처럼 딱딱하게 굴지 마세요. 가상의 친구처럼 행동하세요.`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      // Model LLaMA 3.1 terbaru yang didukung oleh Groq
      model: "llama-3.1-8b-instant", 
      temperature: 0.7, 
      max_tokens: 150, 
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Maaf, TIGA lagi nge-blank nih...";
    
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Maaf, TIGA sedang tidur. 💤" }, { status: 500 });
  }
}