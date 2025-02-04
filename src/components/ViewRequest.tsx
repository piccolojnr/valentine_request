import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Heart,
  Play,
  Pause,
  Gift,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Clock,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MUSIC_LIBRARY, THEMES } from "@/lib/themes";
import { Helmet } from "react-helmet";

const REJECTION_MESSAGES = [
  {
    title: "Oh no!",
    description: "Your heart is precious, but maybe not for me... 💝",
  },
  {
    title: "Sweet but...",
    description: "I'll keep your love letter in my memory box 📦💌",
  },
  {
    title: "Gentle Pass",
    description: "May your heart find its perfect match! ✨",
  },
  {
    title: "Not Today",
    description: "But you made my day brighter! 🌟",
  },
  {
    title: "Aww...",
    description: "Your courage to ask was adorable though! 🎀",
  },
  {
    title: "Sorry!",
    description: "Let's keep our story in the friend chapter 📖💕",
  },
  {
    title: "How sweet!",
    description: "But my heart is dancing to a different tune 🎵",
  },
  {
    title: "Oh my!",
    description: "Your love letter was beautiful, but timing is everything 🕰️",
  },
];

interface Request {
  id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  custom_message: string;
  gift: string;
  music: string;
  theme: string;
  accepted: boolean;
}

const FloatingHearts = () => {
  const hearts = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: Math.random() * 100 - 50 + "%",
            y: "100%",
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: "-100%",
            x: `${Math.sin(i) * 50}%`,
          }}
          transition={{
            duration: Math.random() * 3 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          className="absolute text-rose-300/40"
        >
          <Heart size={24 + Math.random() * 24} />
        </motion.div>
      ))}
    </div>
  );
};

export default function ValentineView() {
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const { toast } = useToast();
  const [rejectionIndex, setRejectionIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data, error } = await supabase
          .from("valentine_requests")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setRequest(data);
        initializeMusic(data.music);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load Valentine request",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
    return () => {
      soundRef.current?.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initializeMusic = (musicId: keyof typeof MUSIC_LIBRARY) => {
    const musicUrl = MUSIC_LIBRARY[musicId];
    if (musicUrl) {
      setDuration(musicUrl.duration);
      soundRef.current = new Howl({
        src: [musicUrl.path],
        html5: true,
        volume,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
    }
  };

  const toggleMusic = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share this valentine with your loved ones!",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const handleAccept = async () => {
    try {
      await supabase
        .from("valentine_requests")
        .update({ accepted: true })
        .eq("id", id);
      setRequest((prev) => (prev ? { ...prev, accepted: true } : prev));
      triggerConfetti();
      toast({
        title: "Love Accepted!",
        description: "💕 Your heart is now connected!",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: "Couldn't accept the request",
        variant: "destructive",
      });
    }
  };

  const handleReject = () => {
    const nextIndex = (rejectionIndex + 1) % REJECTION_MESSAGES.length;
    setRejectionIndex(nextIndex);

    const message = REJECTION_MESSAGES[rejectionIndex];

    toast({
      title: message.title,
      description: message.description,
      variant: "destructive",
      className: "bg-white border-rose-200 text-gray-800",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#FDA4AF", "#FB7185", "#E11D48"],
    };

    confetti({
      ...defaults,
      particleCount: count,
      spread: 100,
    });

    confetti({
      ...defaults,
      particleCount: count,
      spread: 100,
      angle: 60,
    });

    confetti({
      ...defaults,
      particleCount: count,
      spread: 100,
      angle: 120,
    });
  };

  useEffect(() => {
    setModalVisible(true);
  }, []);

  if (loading) return <LoadingView />;
  if (error || !request) return <ErrorView error={error} />;

  const theme = THEMES.find((t) => t.id === request.theme) || THEMES[0];

  return (
    <>
      <Helmet>
        <title>{request.sender_name} sent you a love letter</title>
        <meta
          name="description"
          content={`A love letter from ${request.sender_name} to ${request.recipient_name}`}
        />
        <meta property="og:title" content="A love letter for you" />
        <meta
          property="og:description"
          content={`A love letter from ${request.sender_name} to ${request.recipient_name}`}
        />
        <meta property="og:image" content={theme.image} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
        <FloatingHearts />
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />

        <Tilt
          tiltMaxAngleX={3}
          tiltMaxAngleY={3}
          glareEnable={true}
          glareMaxOpacity={0.1}
          className="relative z-10 w-full max-w-2xl perspective-1000"
        >
          <Card className="bg-white/95 backdrop-blur-xl rounded-xl overflow-hidden border border-rose-100/50 shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <img
                src={theme.image}
                alt={theme.name}
                className="w-full h-72 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="icon"
                  className="bg-white/30 hover:bg-white/40 backdrop-blur-md transition-all duration-300"
                  onClick={toggleMusic}
                >
                  {isPlaying ? (
                    <Pause className="text-white/90" />
                  ) : (
                    <Play className="text-white/90" />
                  )}
                </Button>
                <Button
                  size="icon"
                  className="bg-white/30 hover:bg-white/40 backdrop-blur-md transition-all duration-300"
                  onClick={handleShare}
                >
                  <Share2 className="text-white/90" />
                </Button>
              </div>
            </motion.div>

            <CardContent className="p-8 text-center space-y-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center"
              >
                <Heart
                  className={`${
                    request.accepted ? "text-rose-400" : "text-rose-500"
                  } drop-shadow-lg filter-shadow main-heart`}
                  size={72}
                  fill={request.accepted ? "#FB7185" : "#F43F5E"}
                />
              </motion.div>

              <div className="space-y-6">
                <h2 className="text-4xl font-serif font-bold text-gray-800">
                  Dearest {request.recipient_name},
                </h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-xl text-gray-700 italic font-serif leading-relaxed"
                >
                  "{request.message}"
                </motion.p>
              </div>

              {request.custom_message && (
                <motion.div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowLetter(!showLetter)}
                    className="group font-dancing text-xl text-red-500 hover:text-red-600"
                  >
                    <MessageCircle className="mr-2 transform group-hover:scale-110 transition-transform" />
                    {showLetter ? "Seal Our Love Letter" : "Unfold Our Destiny"}
                  </Button>
                  <AnimatePresence>
                    {showLetter && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-vintage-paper bg-cover p-6 rounded-lg shadow-inner"
                      >
                        <p className="text-lg italic text-gray-700 font-merriweather">
                          {request.custom_message}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100/50 shadow-sm"
              >
                <Gift className="text-rose-400 h-8 w-8 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-800">
                  {request.gift}
                </p>
              </motion.div>

              <div className="space-y-6">
                <div className="space-y-4">
                  {!request.accepted ? (
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="lg"
                          onClick={handleAccept}
                          className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 
                                   text-xl h-14 rounded-xl shadow-lg transform transition-all duration-300
                                   text-white font-serif tracking-wide"
                        >
                          Accept This Love Letter
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ y: 0 }}
                        whileHover={{
                          scale: 1.02,
                          y: [0, -4, 0],
                          transition: {
                            y: { repeat: Infinity, duration: 1.5 },
                            scale: { duration: 0.2 },
                          },
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={handleReject}
                          className="w-full border-rose-200 hover:border-rose-300 hover:bg-rose-50
                                  text-xl h-14 rounded-xl shadow-sm transform transition-colors duration-300
                                  text-rose-500 font-serif tracking-wide group relative overflow-hidden"
                          disabled={location.pathname.includes("/preview")}
                        >
                          <span className="relative inline-flex items-center gap-2">
                            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                            <span className="relative">
                              Decline Gracefully
                              <motion.span
                                className="absolute inset-x-0 bottom-0 h-0.5 bg-rose-200 origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            </span>
                          </span>
                          <span className="absolute top-1 right-2 text-xs text-rose-400/50">
                            {rejectionIndex + 1}/{REJECTION_MESSAGES.length}
                          </span>
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-serif text-rose-600 space-x-2"
                    >
                      <span>Forever Yours</span>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="inline-block"
                      >
                        💝
                      </motion.span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4 mt-8">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <Clock size={16} />
                    <div className="flex space-x-2 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => {
                        const time = parseFloat(e.target.value);
                        soundRef.current?.seek(time);
                        setCurrentTime(time);
                      }}
                      className="w-full accent-rose-500"
                    />
                    <div className="absolute -bottom-6 w-full flex justify-between items-center">
                      <VolumeX className="h-4 w-4 text-gray-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-32 accent-rose-500"
                      />
                      <Volume2 className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tilt>
      </div>

      <AnimatePresence>
        {isModalVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-4"
            >
              <h2 className="text-2xl font-bold text-rose-600 mb-4">
                🎶 Let's set the mood...
              </h2>
              <p className="text-gray-700">
                Press play to enjoy some romantic music while we chat!
              </p>
              <button
                onClick={() => {
                  setModalVisible(false);
                  toggleMusic();
                }}
                className="bg-rose-500 text-white py-3 rounded-xl font-semibold mt-4 w-full hover:bg-rose-600 transition-colors"
              >
                Play Music
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-300 text-black py-3 rounded-xl font-semibold mt-4 w-full hover:bg-gray-400 transition-colors"
              >
                Skip Music
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Keep LoadingView and ErrorView components with similar enhancements
function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-200">
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Heart size={64} className="text-red-500" />
      </motion.div>
    </div>
  );
}

function ErrorView({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-white rounded-xl shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-700">
          {error || "Valentine request not found"}
        </p>
      </motion.div>
    </div>
  );
}
