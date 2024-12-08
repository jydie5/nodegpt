'use client';
// src/components/ChatWrapper.tsx
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('./ChatInterface'), {
  ssr: false
});

export default function ChatWrapper() {
  return <ChatInterface />;
}