// src/types/chat.ts
export interface ChatRequest {
    message: string;
  }
  
  export interface ChatResponse {
    message: string;
    error?: string;
  }