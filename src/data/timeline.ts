export const getTimelineData = (lang: 'id' | 'en' | 'ko') => {
  const data = {
    id: [
      { id: 1, label: "Awal Cerita", title: "Pertemuan Pertama", description: "Awal yang mungkin canggung tapi penuh tawa. Siapa sangka kita bakal se-klik ini?", icon: "👋" },
      { id: 2, label: "Momen Spesial", title: "Ngobrol Santai", description: "Menghabiskan waktu bersama sambil membahas banyak hal seru. Ternyata selera humor kita banyak yang mirip.", icon: "💬" },
      { id: 3, label: "Momen Spesial", title: "Jalan-Jalan Random", description: "Eksplorasi bareng, nyoba hal baru, dan mengambil banyak foto candid yang estetik.", icon: "📸" },
      { id: 4, label: "Momen Spesial", title: "Sesi Ngobrol Asyik", description: "Duduk santai sambil membahas mimpi, hobi, dan keseruan keseharian masing-masing.", icon: "☕" },
      { id: 5, label: "Bab Terakhir", title: "Perpisahan Sementara", description: "Waktu berlalu begitu cepat. Saatnya bilang 'sampai jumpa lagi' untuk petualangan berikutnya.", icon: "✈️" }
    ],
    en: [
      { id: 1, label: "The Beginning", title: "First Meeting", description: "An awkward start but full of laughter. Who knew we would click so easily?", icon: "👋" },
      { id: 2, label: "Special Moment", title: "Casual Chats", description: "Spending quality time talking about fun things. Turns out we share the exact same humor.", icon: "💬" },
      { id: 3, label: "Special Moment", title: "Random Walks", description: "Exploring together, trying new things, and taking lots of aesthetic photos.", icon: "📸" },
      { id: 4, label: "Special Moment", title: "Heart-to-Heart", description: "Sitting around discussing dreams, hobbies, and our everyday stories.", icon: "☕" },
      { id: 5, label: "Final Chapter", title: "A Temporary Goodbye", description: "Time flew by so fast. Time to say 'see you later' for our next adventure.", icon: "✈️" }
    ],
    ko: [
      { id: 1, label: "시작", title: "첫 만남", description: "어색한 시작이었지만 웃음이 가득했지. 우리가 이렇게 잘 맞을 줄 누가 알았겠어?", icon: "👋" },
      { id: 2, label: "특별한 순간", title: "즐거운 수다", description: "재미있는 이야기를 나누며 함께 보낸 소중한 시간. 유머 코드가 정말 잘 맞아.", icon: "💬" },
      { id: 3, label: "특별한 순간", title: "무작정 걷기", description: "함께 돌아다니며 새로운 것도 시도하고, 느낌 있는 사진도 많이 남겼지.", icon: "📸" },
      { id: 4, label: "특별한 순간", title: "편안한 대화", description: "편하게 둘러앉아 꿈과 취미, 소소한 일상을 이야기하던 시간.", icon: "☕" },
      { id: 5, label: "마지막 장", title: "잠시만 안녕", description: "시간이 정말 빨리 갔어. 다음 만남을 기약하며 '다음에 또 봐'라고 말할 시간.", icon: "✈️" }
    ]
  };
  return data[lang];
};