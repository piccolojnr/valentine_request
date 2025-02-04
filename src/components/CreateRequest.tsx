import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Heart, Shuffle, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { MUSIC_LIBRARY, MUSIC_LIBRARY_LIST, THEMES } from "@/lib/themes";
import { motion, AnimatePresence } from "framer-motion";

// -----------------------
// Data & Schema
// -----------------------

const GIFT_OPTIONS = [
  "🌹 Red Rose Bouquet",
  "🍫 Luxury Chocolate Box",
  "🧸 Cuddly Teddy Bear",
  "💝 Heart Locket",
  "🎵 Love Song Dedication",
  "✨ Star Named After You",
  "💌 Love Letter Collection",
  "🎪 Romantic Date Voucher",
  "🌟 Promise Ring",
  "🎭 Theater Tickets",
];

const CreateRequestSchema = z.object({
  senderName: z.string().nonempty(),
  recipientName: z.string().nonempty(),
  message: z.string().nonempty(),
  customMessage: z.string().optional(),
  gift: z.string().nonempty(),
  theme: z.string().nonempty(),
  music: z.string().nonempty(),
});

type CreateRequestData = z.infer<typeof CreateRequestSchema>;

// -----------------------
// Main Component
// -----------------------

export default function CreateValentineRequest() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit, watch, trigger, setValue } =
    useForm<CreateRequestData>({
      defaultValues: {
        senderName: "",
        recipientName: "",
        message: "",
        customMessage: "",
        gift: "",
        theme: "",
        music: "",
      },
    });

  // Watch all form fields to update the preview in real time
  const formValues = watch();

  // -----------------------
  // Navigation & Helpers
  // -----------------------

  const nextStep = async () => {
    const isValid = await trigger(
      currentStep === 1
        ? ["senderName", "recipientName"]
        : currentStep === 2
        ? ["message"]
        : currentStep === 3
        ? ["gift"]
        : currentStep === 4
        ? ["music"]
        : []
    );

    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const randomGift = () => {
    const random =
      GIFT_OPTIONS[Math.floor(Math.random() * GIFT_OPTIONS.length)];
    setValue("gift", random, { shouldValidate: true });
  };

  const randomTheme = () => {
    const random = THEMES[Math.floor(Math.random() * THEMES.length)];
    setValue("theme", random.id, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateRequestData) => {
    setIsSubmitting(true);
    try {
      const { data: insertedData, error } = await supabase
        .from("valentine_requests")
        .insert([
          {
            sender_name: data.senderName,
            recipient_name: data.recipientName,
            message: data.message,
            custom_message: data.customMessage || null,
            gift: data.gift,
            theme: data.theme,
            music: data.music,
            accepted: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      navigate(`/share/${insertedData.id}`);
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: "Could not create request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------
  // Render
  // -----------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Heart className="mx-auto h-16 w-16 text-rose-500 animate-pulse" />
          <h1 className="text-4xl font-serif text-gray-800 mt-4">
            Create Your Valentine Request
          </h1>
          <p className="text-rose-600 mt-2 font-light">
            Express your love with elegance
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border-rose-100">
            <CardHeader className="border-b border-gray-200 p-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Step {currentStep} of 5
              </CardTitle>
              <Progress value={(currentStep / 5) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="p-4 h-[calc(100vh-16rem)]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative h-full overflow-y-auto p-2"
              >
                <AnimatePresence>
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Label>Your Name</Label>
                          <Controller
                            name="senderName"
                            control={control}
                            rules={{ required: "Sender name is required" }}
                            render={({ field, fieldState }) => (
                              <>
                                <Input
                                  className="border-rose-200 focus:border-rose-500 transition-colors duration-300"
                                  {...field}
                                  placeholder="Enter your name"
                                />
                                {fieldState.error && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div>
                          <Label>Recipient&apos;s Name</Label>
                          <Controller
                            name="recipientName"
                            control={control}
                            rules={{ required: "Recipient name is required" }}
                            render={({ field, fieldState }) => (
                              <>
                                <Input
                                  className="border-rose-200 focus:border-rose-500 transition-colors duration-300"
                                  {...field}
                                  placeholder="Enter recipient's name"
                                />
                                {fieldState.error && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Label>Your Message</Label>
                          <Controller
                            name="message"
                            control={control}
                            rules={{ required: "Message is required" }}
                            render={({ field, fieldState }) => (
                              <>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder="Write a heartfelt message"
                                />
                                {fieldState.error && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div>
                          <Label>Custom Note (Optional)</Label>
                          <Controller
                            name="customMessage"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Add a custom note"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Choose a Virtual Gift</Label>
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={randomGift}
                            title="Surprise me!"
                          >
                            <Shuffle className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Controller
                            name="gift"
                            control={control}
                            rules={{ required: "Please choose a gift" }}
                            render={({ field }) => (
                              <>
                                {GIFT_OPTIONS.map((gift) => (
                                  <Button
                                    key={gift}
                                    type="button"
                                    variant={
                                      field.value === gift
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => field.onChange(gift)}
                                    className="w-full"
                                  >
                                    {gift}
                                  </Button>
                                ))}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Controller
                        name="music"
                        control={control}
                        rules={{ required: "Please choose a love song" }}
                        render={({ field }) => (
                          <MusicSelector
                            value={field.value}
                            onChange={field.onChange}
                            musicList={MUSIC_LIBRARY_LIST}
                            musicLibrary={MUSIC_LIBRARY}
                          />
                        )}
                      />
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Choose a Theme</Label>
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={randomTheme}
                            title="Surprise me!"
                          >
                            <Shuffle className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Controller
                            name="theme"
                            control={control}
                            rules={{ required: "Please choose a theme" }}
                            render={({ field }) => (
                              <>
                                {THEMES.map((theme) => (
                                  <Button
                                    key={theme.id}
                                    type="button"
                                    className={cn(
                                      "relative rounded-lg overflow-hidden h-24 transition-transform duration-300",
                                      field.value === theme.id
                                        ? "ring-4 ring-red-400 scale-105"
                                        : "hover:scale-105"
                                    )}
                                    onClick={() => field.onChange(theme.id)}
                                  >
                                    <img
                                      src={theme.image}
                                      alt={theme.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-40" />
                                    <span className="absolute bottom-2 left-2 text-white font-semibold">
                                      {theme.name}
                                    </span>
                                  </Button>
                                ))}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}

                <div className="flex justify-between mt-6 absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  )}
                  {currentStep < 5 && (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto bg-rose-500 hover:bg-rose-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Next
                    </Button>
                  )}
                  {currentStep === 5 && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto bg-rose-500 hover:bg-rose-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? "Creating..." : "Create Request"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <PreviewCard formData={formValues} />
        </div>
      </div>
    </div>
  );
}

// -----------------------
// Preview Card Component
// -----------------------

function PreviewCard({ formData }: { formData: CreateRequestData }) {
  // Find the selected theme details (if any)
  const selectedTheme = THEMES.find((theme) => theme.id === formData.theme);

  return (
    <Card className="bg-white shadow-2xl rounded-lg overflow-hidden">
      {selectedTheme ? (
        <div className="relative h-48">
          <img
            src={selectedTheme.image}
            alt={selectedTheme.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl font-bold">{selectedTheme.name} Theme</h2>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <Eye className="h-8 w-8 text-gray-500" />
        </div>
      )}
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Preview</h3>
        <p className="text-sm text-gray-700">
          <strong>From:</strong> {formData.senderName || "Your Name"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>To:</strong> {formData.recipientName || "Recipient's Name"}
        </p>
        <p className="mt-2 text-sm text-gray-600 italic">
          {formData.message || "Your heartfelt message will appear here..."}
        </p>
        {formData.customMessage && (
          <p className="mt-2 text-sm text-gray-600">
            <em>Note:</em> {formData.customMessage}
          </p>
        )}
        {formData.gift && (
          <p className="mt-2 text-sm text-gray-700">
            <strong>Gift:</strong> {formData.gift}
          </p>
        )}
        {formData.music && (
          <p className="mt-2 text-sm text-gray-700">
            <strong>Song:</strong>{" "}
            {MUSIC_LIBRARY_LIST.find((music) => music.id === formData.music)
              ?.title || formData.music}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MusicSelectorProps {
  value: string;
  onChange: (value: string) => void;
  musicList: typeof MUSIC_LIBRARY_LIST;
  musicLibrary: typeof MUSIC_LIBRARY;
}

const MusicSelector = ({
  value,
  onChange,
  musicList,
  musicLibrary,
}: MusicSelectorProps) => {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  // Cleanup function for audio
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, []);

  const playMusic = (musicId: string) => {
    // Stop current playing sound
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      if (currentPlayingId === musicId) {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        return;
      }
    }

    const musicUrl = (musicLibrary as any)[musicId];
    if (musicUrl) {
      soundRef.current = new Howl({
        src: [musicUrl.path],
        html5: true,
        volume: 0.5,
        onend: () => {
          setIsPlaying(false);
          setCurrentPlayingId(null);
        },
        sprite: {
          preview: [0, 15000], // 15 second preview
        },
      });

      soundRef.current.play("preview");
      setIsPlaying(true);
      setCurrentPlayingId(musicId);
    }
  };

  const randomMusic = () => {
    const random = musicList[Math.floor(Math.random() * musicList.length)];
    onChange(random.id);
    playMusic(random.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Choose Your Love Song</Label>
        <Button
          variant="ghost"
          type="button"
          onClick={randomMusic}
          title="Surprise me!"
        >
          <Shuffle className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {musicList.map((music) => (
          <Button
            key={music.id}
            type="button"
            variant={value === music.id ? "default" : "outline"}
            onClick={() => {
              onChange(music.id);
              playMusic(music.id);
            }}
            className="w-full flex justify-between items-center"
          >
            <span>
              {music.emoji} {music.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {music.artist}
              </span>
              {currentPlayingId === music.id && (
                <div className="w-4 h-4 relative">
                  <motion.div
                    className="absolute inset-0 border-2 border-current rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
              {value === music.id && (
                <span className="w-2 h-2 bg-current rounded-full" />
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
