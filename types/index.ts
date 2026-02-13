export interface MovieStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  negative: string;
  color: string; // Tailwind color class for card styling
}

export interface GenerateRequest {
  style: string;
  userInput: string;
  clientId?: string;
}

export interface GenerateResponse {
  imageUrl: string;
  promptId?: string;
}
