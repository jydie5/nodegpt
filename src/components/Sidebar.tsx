'use client';

import { useEffect, useState } from 'react';
import { Session } from '@prisma/client';

interface SidebarProps {
  onSessionSelect: (sessionId: string) => void;
}

const Sidebar = ({ onSessionSelect }: SidebarProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/sessions');
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setSessions([]);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 h-screen overflow-y-auto">
      <button
        onClick={() => onSessionSelect('')}
        className="w-full mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        New Chat
      </button>
      
      <div className="space-y-2">
        {sessions && sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSessionSelect(session.id)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            {new Date(session.start_time).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 