export interface ValentineRequest {
  id: string;
  senderName: string;
  recipientName: string;
  message: string;
  gift: string;
  theme: string;
  customMessage?: string;
  accepted?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  gradient: string;
  image: string;
}

export interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
  shareUrl: string;
}