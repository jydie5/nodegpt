// src/app/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';
import ChatWrapper from '@/components/ChatWrapper';

export default function Home() {
  const handleSessionSelect = (sessionId: string) => {
    console.log('Selected:', sessionId);
    // セッション選択時の処理をここに実装
  };

  return (
    <main className="flex h-screen">
      <Sidebar onSessionSelect={handleSessionSelect} />
      <div className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ChatWrapper />
      </div>
    </main>
  );
}