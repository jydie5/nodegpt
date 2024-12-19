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

    // 直近10件のメッセージのみを使用
    const recentMessages = messages.slice(-10);

    // 会話履歴を含めたメッセージ配列を作成
    const conversationMessages = [
      {
        role: "system",
        content: "you are best assistant. you think step by step. output must be Japanese."
      },
      ...recentMessages
    ];

    const result = await streamText({
      model: openai('gpt-4o'),
      messages: conversationMessages,
      maxTokens: 16000, // GPT-4のトークン制限に合わせて設定
      temperature: 0.7,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    const e = error as OpenAIError;
    console.error('Error:', e);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: e.message 
      }),
      { status: 500 }
    );
  }
}