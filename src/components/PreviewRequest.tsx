import { useEffect, useState } from "react";
import {
  Share2,
  Eye,
  ClipboardCopy,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
  shareUrl: string;
}

interface SocialShareProps {
  requestData: any;
  shareUrl: string;
  onShare: (title: string, description: string, variant?: string) => void;
}

const SocialShare = ({ requestData, shareUrl, onShare }: SocialShareProps) => {
  const { id } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onShare("Success", "Link copied to clipboard");
    } catch (err) {
      onShare("Error", "Could not copy link", "destructive");
    }
  };

  const socialPlatforms: SocialPlatform[] = [
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      shareUrl: `https://wa.me/?text=${encodeURIComponent(
        `💝 ${requestData?.sender_name} sent you a special Valentine's request! Check it out here: ${shareUrl}`
      )}`,
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(
        `💝 ${requestData?.sender_name} sent you a special Valentine's request!`
      )}`,
    },
    {
      name: "Facebook",
      icon: "👥",
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "X (Twitter)",
      icon: "🐦",
      color: "bg-black",
      hoverColor: "hover:bg-gray-800",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `💝 Check out this special Valentine's request from ${requestData?.sender_name}!`
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const handleSocialShare = (platform: any) => {
    window.open(platform.shareUrl, "_blank", "noopener,noreferrer");
    setIsShareOpen(false);
    onShare("Shared", `Opening ${platform.name}...`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-rose-50/50 p-4 rounded-lg border border-rose-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 mb-1">Share this link:</p>
            <p className="font-mono text-sm truncate">{shareUrl}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyLink}
            className="flex-shrink-0"
          >
            {isCopied ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardCopy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white transition-all duration-300">
              <Share2 className="mr-2 h-4 w-4" />
              Share Love
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share your Valentine Request</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 p-4">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={() => handleSocialShare(platform)}
                  className={`${platform.color} ${platform.hoverColor} text-white transition-all duration-300`}
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="secondary" onClick={() => navigate(`/preview/${id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>
    </div>
  );
};

// Update the main component to use the new SocialShare component
export default function PreviewRequest() {
  const { id } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/view/${id}`;

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const { data, error } = await supabase
          .from("valentine_requests")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setRequestData(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Could not load request details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestData();
  }, [id]);

  const handleShare = (
    title: string,
    description: string,
    variant: any = "default"
  ) => {
    toast({
      title,
      description,
      variant,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border border-rose-100 rounded-xl">
        <CardHeader>
          <CardTitle className="text-center font-serif text-2xl text-gray-800">
            Your Valentine Request is Ready
          </CardTitle>
          <p className="text-center text-rose-600 font-light">
            Share the love with someone special
          </p>
        </CardHeader>
        <CardContent>
          <SocialShare
            requestData={requestData}
            shareUrl={shareUrl}
            onShare={handleShare}
          />
        </CardContent>
      </Card>
    </div>
  );
}
