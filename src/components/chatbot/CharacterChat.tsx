"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  X,
  Send,
  Sparkles,
} from "lucide-react";

import {
  Character,
} from "../../data/characters";

import {
  useAppStore,
} from "../../store/useAppStore";

import {
  useAudio,
} from "../../hooks/useAudio";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CharacterChatProps {
  character: Character;
  onClose: () => void;
}

export default function CharacterChat({
  character,
  onClose,
}: CharacterChatProps) {
  const { language } =
    useAppStore();

  const { playSfx } =
    useAudio();

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          getOpeningMessage(
            character,
            language
          ),
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sendMessage = async (
    event?: FormEvent
  ) => {
    event?.preventDefault();

    const text =
      input.trim();

    if (!text || loading) {
      return;
    }

    if (text.length > 500) {
      return;
    }

    playSfx("click");

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    const nextMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/character-chat",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              characterId:
                character.id,
              message: text,
              language,
              history:
                messages.slice(-10),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Chat failed."
        );
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      playSfx("click");
    } catch (error) {
      console.error(error);

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            language === "ko"
              ? "잠깐만... 지금은 대화하기 힘들어 😭"
              : language === "en"
              ? "Wait... I can't talk right now 😭"
              : "Bentar... gue lagi nggak bisa ngobrol 😭",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      fixed
      inset-0
      z-[100]
      flex
      items-end
      justify-center
      p-4
      sm:items-center
      bg-black/25
      backdrop-blur-[2px]
    ">
      <div className="
        w-full
        max-w-md
        overflow-hidden
        rounded-3xl
        border-2
        border-capsule-navy
        bg-capsule-cream
        shadow-pixel
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          justify-between
          border-b-2
          border-capsule-navy
          bg-white/80
          px-4
          py-3
        ">
          <div className="
            flex
            items-center
            gap-3
          ">
            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border-2
              border-capsule-navy
              bg-capsule-pastelYellow
            ">
              ✦
            </div>

            <div>
              <div className="
                font-black
                text-capsule-navy
              ">
                {character.name}
              </div>

              <div className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-capsule-purple
              ">
                {character.mbti}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSfx("click");
              onClose();
            }}
            className="
              rounded-lg
              p-2
              text-capsule-navy
              hover:bg-black/5
            "
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* MESSAGES */}

        <div className="
          flex
          h-[55vh]
          max-h-[500px]
          min-h-[320px]
          flex-col
          gap-3
          overflow-y-auto
          p-4
        ">
          {messages.map(
            (message, index) => (
              <div
                key={index}
                className={`
                  flex
                  ${
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                }
                `}
              >
                <div
                  className={`
                    max-w-[82%]
                    rounded-2xl
                    border-2
                    border-capsule-navy
                    px-3
                    py-2.5
                    text-sm
                    leading-relaxed
                    ${
                      message.role ===
                      "user"
                        ? "bg-capsule-pastelYellow"
                        : "bg-white"
                    }
                  `}
                >
                  {message.content}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="
              flex
              justify-start
            ">
              <div className="
                flex
                items-center
                gap-2
                rounded-2xl
                border-2
                border-capsule-navy
                bg-white
                px-4
                py-3
                text-xs
                font-bold
                text-capsule-purple
              ">
                <Sparkles
                  size={14}
                  className="animate-pulse"
                />

                {language === "ko"
                  ? "생각 중..."
                  : language === "en"
                  ? "Thinking..."
                  : "Lagi mikir..."}
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}

        <form
          onSubmit={sendMessage}
          className="
            flex
            gap-2
            border-t-2
            border-capsule-navy
            bg-white/70
            p-3
          "
        >
          <input
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            maxLength={500}
            disabled={loading}
            placeholder={
              language === "ko"
                ? "메시지를 입력하세요..."
                : language === "en"
                ? "Say something..."
                : "Ngomong sesuatu..."
            }
            className="
              min-w-0
              flex-1
              rounded-xl
              border-2
              border-capsule-navy
              bg-white
              px-3
              py-2.5
              text-sm
              outline-none
              focus:ring-2
              focus:ring-capsule-mutedPink
            "
          />

          <button
            type="submit"
            disabled={
              loading ||
              !input.trim()
            }
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border-2
              border-capsule-navy
              bg-capsule-pastelYellow
              text-capsule-navy
              shadow-pixel-sm
              transition
              hover:translate-x-[1px]
              hover:translate-y-[1px]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Send size={17} />
          </button>
        </form>

      </div>
    </div>
  );
}

function getOpeningMessage(
  character: Character,
  language: "id" | "en" | "ko"
) {
  if (language === "ko") {
    return `안녕! 나는 ${character.name}이야. 뭐 하고 있었어?`;
  }

  if (language === "en") {
    return `Hey! It's ${character.name}. What are you doing here?`;
  }

  const openings: Record<string, string> = {
    adit:
      "Lah lu ngapain manggil gue? 😭",
    rio:
      "Waduh, nyari gue? Kenapa nih 😭",
    bian:
      "Hai. Gimana kabarmu?",
    yoon:
      "Oh. Kamu datang.",
    dongkyun:
      "Hm? Kenapa?",
    jueun:
      "Heiii! Kamu datang juga! 🥹",
    suah:
      "Hai. Kamu baik-baik saja?",
    ika:
      "Hm... gue ngantuk.",
    naufal:
      "Eh. Ada apa?",
  };

  return (
    openings[character.id] ||
    `Hai, aku ${character.name}.`
  );
}