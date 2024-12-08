// src/app/page.tsx
import ChatWrapper from '@/components/ChatWrapper';

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <ChatWrapper />
      </div>
    </main>
  );
}