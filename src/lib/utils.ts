import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getSocialPlatforms = (
  requestData: any,
  shareUrl: string,
  type: "invite" | "brag" = "invite"
) => {
  // Custom messages based on the type parameter
  const inviteText = `💝 ${requestData?.sender_name} sent you a special Valentine's request!`;
  const bragText = `🔥 ${requestData?.sender_name} just achieved something amazing!`;
  const message = type === "invite" ? inviteText : bragText;

  return [
    {
      name: "WhatsApp",
      icon: "💬",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      shareUrl: `https://wa.me/?text=${encodeURIComponent(
        `${message} Check it out here: ${shareUrl}`
      )}`,
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(message)}`,
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
        message
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];
};