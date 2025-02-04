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