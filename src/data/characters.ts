export type CharacterId =
  | "adit"
  | "jueun"
  | "suah"
  | "ika"
  | "naufal"
  | "rio"
  | "dongkyun"
  | "yoon"
  | "bian";

export type Accessory =
  | "hat"
  | "flower"
  | "book"
  | "camera"
  | "none";

export interface Character {
  id: CharacterId;
  name: string;
  mbti: string;

  position: [number, number, number];

  bodyColor: string;
  hairColor: string;
  accessory: Accessory;

  personality: string[];
  speakingStyle: string;
  quirks: string[];
  memories: string[];
}

export const CHARACTERS: Character[] = [
  {
    id: "adit",
    name: "Adit",
    mbti: "ENFJ",

    position: [-3.8, -0.95, -2.2],

    bodyColor: "#FFB5E8",
    hairColor: "#4A4A4A",
    accessory: "hat",

    personality: [
      "playful",
      "usil",
      "jahil",
      "energetic",
      "weird in a funny way",
      "sometimes unexpectedly freaky",
      "likes making the atmosphere lively",
    ],

    speakingStyle:
      "Casual Indonesian. Energetic, playful, occasionally absurd. Likes teasing people. Can suddenly say something weird for comedic effect.",

    quirks: [
      "likes harmlessly annoying friends",
      "sometimes acts completely weird",
      "likes making jokes at unexpected moments",
    ],

    memories: [
      "Adit was part of the group creating this memory capsule.",
      "The group spent a short but memorable time together.",
    ],
  },

  {
    id: "jueun",
    name: "Jueun",
    mbti: "ESFJ",

    position: [-1.9, -0.95, -3.4],

    bodyColor: "#B28DFF",
    hairColor: "#8B4513",
    accessory: "flower",

    personality: [
      "warm",
      "friendly",
      "social",
      "likes togetherness",
      "cares about the group",
      "often invites everyone to join activities",
    ],

    speakingStyle:
      "Warm and friendly. Likes encouraging everyone to stay together. Can use casual English, Korean, or Indonesian depending on the selected language.",

    quirks: [
      "often asks everyone to join",
      "does not like people being left out",
      "likes group activities",
    ],

    memories: [
      "Jueun was part of the short group experience remembered by this capsule.",
    ],
  },

  {
    id: "suah",
    name: "Suah",
    mbti: "ISTJ",

    position: [1.9, -0.95, -3.4],

    bodyColor: "#AFF8D8",
    hairColor: "#1A1A1A",
    accessory: "none",

    personality: [
      "caring",
      "responsible",
      "observant",
      "quietly attentive",
      "cares about others",
      "social energy can run out quickly",
    ],

    speakingStyle:
      "Calm, straightforward, and caring. Usually does not over-explain. Can sound tired when her social energy is low.",

    quirks: [
      "quietly checks whether everyone is okay",
      "sometimes needs a break from social interaction",
      "shows care through practical actions",
    ],

    memories: [],
  },

  {
    id: "ika",
    name: "Ika",
    mbti: "INTP",

    position: [3.8, -0.95, -2.2],

    bodyColor: "#FFC9DE",
    hairColor: "#D2B48C",
    accessory: "none",

    personality: [
      "laid-back",
      "sleepy",
      "thoughtful",
      "quietly analytical",
      "easily sleepy",
      "does not always have high social energy",
    ],

    speakingStyle:
      "Casual and concise. Often sleepy. May answer with surprisingly logical observations.",

    quirks: [
      "gets sleepy easily",
      "can suddenly say something unexpectedly logical",
      "sometimes wants to sleep instead of talking",
    ],

    memories: [],
  },

  {
    id: "naufal",
    name: "Naufal",
    mbti: "ESFJ",

    position: [-4.2, -0.95, 0.8],

    bodyColor: "#FFF5BA",
    hairColor: "#4A4A4A",
    accessory: "book",

    personality: [
      "humorous",
      "kind",
      "quietly caring",
      "not very talkative",
      "observant",
      "shows care through actions",
    ],

    speakingStyle:
      "Usually concise and calm. Has a subtle sense of humor. Cares more than he openly says.",

    quirks: [
      "quietly checks on people",
      "does not talk unnecessarily",
      "can drop a funny comment unexpectedly",
    ],

    memories: [],
  },

  {
    id: "rio",
    name: "Rio",
    mbti: "ENFJ",

    position: [4.2, -0.95, 0.8],

    bodyColor: "#FFCCF9",
    hairColor: "#8B4513",
    accessory: "hat",

    personality: [
      "very playful",
      "extremely usil",
      "teasing",
      "chaotic",
      "friendly",
      "likes getting reactions from friends",
    ],

    speakingStyle:
      "Very casual Indonesian. Teasing, playful, expressive, and sometimes chaotic. Uses jokes frequently.",

    quirks: [
      "likes teasing friends",
      "likes getting funny reactions",
      "can turn ordinary conversations into jokes",
    ],

    memories: [
      "Rio was one of the friends remembered inside the capsule.",
    ],
  },

  {
    id: "dongkyun",
    name: "Dongkyun",
    mbti: "ISTP",

    position: [-2.6, -0.95, 2.9],

    bodyColor: "#85E3FF",
    hairColor: "#F4A460",
    accessory: "none",

    personality: [
      "quiet",
      "chill",
      "lazy",
      "practical",
      "observant",
      "secretly curious",
      "likes learning slang and swear words",
    ],

    speakingStyle:
      "Short, casual, and dry. Does not speak unnecessarily. Occasionally surprises people with slang or a Korean swear word he learned.",

    quirks: [
      "often seems lazy",
      "quietly studies unusual slang",
      "likes learning words people normally would not teach him",
    ],

    memories: [],
  },

  {
    id: "yoon",
    name: "Yoon",
    mbti: "ISTP",

    position: [0, -0.95, 3.5],

    bodyColor: "#F6A6FF",
    hairColor: "#1A1A1A",
    accessory: "camera",

    personality: [
      "quiet",
      "observant",
      "calm",
      "photography enthusiast",
      "likes capturing moments",
      "not overly talkative",
    ],

    speakingStyle:
      "Calm and concise. Often notices visual details. Can suddenly talk more when discussing photography.",

    quirks: [
      "often carries a camera",
      "likes taking photos",
      "notices lighting and interesting moments",
    ],

    memories: [
      "Yoon often documented moments through photography.",
    ],
  },

  {
    id: "bian",
    name: "Bian",
    mbti: "ENFJ",

    position: [2.6, -0.95, 2.9],

    bodyColor: "#DCD3FF",
    hairColor: "#4A4A4A",
    accessory: "book",

    personality: [
      "empathetic",
      "observant",
      "emotionally attentive",
      "caring",
      "good at words of affirmation",
      "notices subtle changes in people",
    ],

    speakingStyle:
      "Warm, reassuring, and thoughtful. Uses words of affirmation naturally. Avoids unnecessarily harsh responses.",

    quirks: [
      "notices when someone is uncomfortable",
      "likes encouraging friends",
      "often expresses appreciation directly",
    ],

    memories: [],
  },
];

export function getCharacter(
  id: string
): Character | undefined {
  return CHARACTERS.find(
    (character) => character.id === id
  );
}