export const getGalleryPhotos = (lang: 'id' | 'en' | 'ko') => {
  const basePhotos = [
    { id: 1, url: "/images/photo1.jpg", tilt: "-rotate-3" },
    { id: 2, url: "/images/photo2.jpg", tilt: "rotate-2" },
    { id: 3, url: "/images/photo3.jpg", tilt: "-rotate-2" },
    { id: 4, url: "/images/photo4.jpg", tilt: "rotate-3" },
    { id: 5, url: "/images/photo5.jpg", tilt: "-rotate-1" },
  ];

  const captions = {
    id: ["Formasi lengkap Tim Tiga ✦", "Tempat favorit ngobrol santai", "Keseruan di sela-sela aktivitas", "Tertawa lepas tanpa beban", "Kenangan indah yang abadi"],
    en: ["Tim Tiga full formation ✦", "Our favorite hangout spot", "Fun moments in between", "Laughter without worries", "Memories to cherish forever"],
    ko: ["팀 티가 완전체 ✦", "가장 좋아하는 아지트", "활동 사이의 즐거운 순간들", "걱정 없이 함께 웃던 시간", "영원히 간직할 추억"]
  };

  return basePhotos.map((photo, index) => ({
    ...photo,
    caption: captions[lang][index]
  }));
};