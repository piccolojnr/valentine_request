import { useState } from "react";
import { Share2, Eye, ClipboardCopy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { SocialPlatform } from "@/types";
import { getSocialPlatforms } from "@/lib/utils";

interface SocialShareProps {
  requestData: any;
  shareUrl: string;
  onShare: (title: string, description: string, variant?: string) => void;
}

const SocialShare = ({ requestData, shareUrl, onShare }: SocialShareProps) => {
  const { id } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onShare("Success", "Link copied to clipboard");
    } catch (err) {
      console.error(err);
      onShare("Error", "Could not copy link", "destructive");
    }
  };

  const socialPlatforms: SocialPlatform[] = getSocialPlatforms(
    requestData,
    shareUrl
  );

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
        <ShareLove
          socialPlatforms={socialPlatforms}
          trigger={
            <Button className="bg-rose-500 hover:bg-rose-600 text-white transition-all duration-300">
              <Share2 className="mr-2 h-4 w-4" />
              Share Love
            </Button>
          }
        />

        <Button variant="secondary" onClick={() => navigate(`/preview/${id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>
    </div>
  );
};

interface ShareLoveProps {
  socialPlatforms: SocialPlatform[];
  trigger: React.ReactNode;
  onShare?: (title: string, description: string) => void;
}

const ShareLove = ({ socialPlatforms, trigger, onShare }: ShareLoveProps) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleSocialShare = (platform: any) => {
    window.open(platform.shareUrl, "_blank", "noopener,noreferrer");
    setIsShareOpen(false);
    onShare?.("Shared", `Opening ${platform.name}...`);
  };

  return (
    <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
  );
};

export { SocialShare, ShareLove };
