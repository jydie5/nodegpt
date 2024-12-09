// src/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Edge環境で実行
export const runtime = 'edge';

// エラー型の定義
interface OpenAIError extends Error {
  status?: number;
  code?: string;
  type?: string;
}

export async function POST(req: Request) {
  if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
    return new Response(
      JSON.stringify({ error: 'Azure OpenAI API key or endpoint is not configured' }),
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400 }
      );
    }

    const result = await streamText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: "system",
          content: "you are best assistant. you think step by step. output must be Japanese."
        },
        ...messages
      ],
    });

    return result.toDataStreamResponse();
    
  } catch (error: OpenAIError) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500 }
    );
  }
}