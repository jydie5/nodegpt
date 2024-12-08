// src/app/api/chat/route.ts
import { AzureOpenAI } from 'openai'; // 仮のモジュール名
import { NextResponse } from 'next/server';
import type { ChatCompletionMessage } from 'openai/resources/chat/completions';




const openai = new AzureOpenAI({
  // azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT as string,
  // // ... existing code ...
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-07-01-preview"
});

export async function POST(req: Request) {
  if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
    return NextResponse.json(
      { error: 'Azure OpenAI API key or endpoint is not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "you are best assistant. you think step by step. output must be Japanese."
        },
        {
          role: "user",
          content: message
        }
      ],
      // max_tokens: 2000,
      // temperature: 0.7,
    });

    const reply = response.choices[0].message;

    return NextResponse.json({
      message: reply.content
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}