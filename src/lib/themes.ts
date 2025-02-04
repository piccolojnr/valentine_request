
export const THEMES = [
    {
        id: "classic_romance",
        name: "Classic Romance",
        gradient: "from-rose-100 via-pink-100 to-rose-200",
        colors: ["#FFE4E6", "#FDA4AF"],
        image:
            "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800",
    },
    {
        id: "midnight_passion",
        name: "Midnight Passion",
        gradient: "from-indigo-900 via-purple-900 to-pink-900",
        colors: ["#312E81", "#831843"],
        image:
            "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800",
    },
    {
        id: "enchanted_garden",
        name: "Enchanted Garden",
        gradient: "from-emerald-100 via-rose-100 to-emerald-200",
        colors: ["#ECFDF5", "#FCE7F3"],
        image:
            "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800",
    },
    {
        id: "golden_sunset",
        name: "Golden Sunset",
        gradient: "from-amber-100 via-rose-100 to-amber-200",
        colors: ["#FEF3C7", "#FEE2E2"],
        image:
            "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800",
    },
];


export const MUSIC_LIBRARY = {
    midnight_glow: {
        path: "/midnight_glow.mp3",
        duration: 3 * 60 + 13,
        title: "Midnight Glow",
        emoji: "🌙",
        artist: "Eternal Garden",
    },
    midnight_rain: {
        path: "/midnight_rain.mp3",
        duration: 3 * 60 + 3,
        title: "Midnight Rain",
        emoji: "🌧️",
        artist: "Eternal Garden",
    },
    under_the_moonlight: {
        path: "/under_the_moonlight.mp3",
        duration: 3 * 60 + 13,
        title: "Under the Moonlight",
        emoji: "🌌",
        artist: "Eternal Garden",
    },
    starry_whisper: {
        path: "/starry_whisper.mp3",
        duration: 3 * 60 + 6,
        title: "Starry Whisper",
        emoji: "🌠",
        artist: "Eternal Garden",
    },
    whispering_secrets: {
        path: '/whispering_secrets.mp3',
        duration: 3 * 60 + 52,
        title: "Whispering Secrets",
        emoji: "🤫",
    },
    whispers_in_the_dark: {
        path: "/whispers_in_the_dark.mp3",
        duration: 4 * 60,
        title: "Whispers in the Dark",
        emoji: "🌑",
        artist: "Eternal Garden",
    }
};


export const MUSIC_LIBRARY_LIST = Object.keys(MUSIC_LIBRARY).map((id) => ({
    id: id,
    ...(MUSIC_LIBRARY as any)[id]
}))