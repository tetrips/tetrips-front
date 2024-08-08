'use client';


import { PlusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Guest } from '@/types/Project';

interface Message {
  nickname: string;
  message: string;
  userId: string;
  prId: string;
  timestamp: number;
}

export default function ChatBox({ projectId, userData }: { projectId: string, userData: Guest }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const userId = userData.email;
  const nickname = userData.nickname;

  useEffect(() => {
    ydocRef.current = new Y.Doc();
    const yarray = ydocRef.current.getArray<Message>('messages');

    providerRef.current = new WebsocketProvider(
      'wss://demos.yjs.dev/ws', 
      `test-project-chatttt-room-${projectId}`,
      ydocRef.current
    );

    providerRef.current.on('status', ({ status }: { status: string }) => {
      setIsConnected(status === 'connected');
      if (status === 'connected') {
        setError(null);
      }
    });

    providerRef.current.on('connection-error', (event: Event) => {
      setError('연결 오류가 발생했습니다. 다시 시도해주세요.');
    });

    const updateMessages = () => {
      const sortedMessages = [...yarray.toArray()].sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sortedMessages);
    };

    yarray.observe(updateMessages);
    updateMessages();

    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, [projectId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (input.trim() && ydocRef.current && isConnected) {
      const yarray = ydocRef.current.getArray<Message>('messages');
      const newMessage: Message = {
        nickname,
        message: input.trim(),
        userId,
        prId: projectId,
        timestamp: Date.now(),
      };
      yarray.push([newMessage]);
      setInput('');
    }
  }, [input, nickname, userId, projectId, isConnected]);

  const formatTimestamp = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);
  
  const messagesList = messages.map((msgObj, index) => {
    const messageTime = formatTimestamp(msgObj.timestamp);
  
    return (
      <div key={`${msgObj.userId}-${msgObj.timestamp}`} className={`flex ${msgObj.userId === userId ? 'justify-end' : 'justify-start'}`}>
        {msgObj.userId !== userId && (
          <div className="flex flex-col items-center mr-2">
            <div className="w-8 h-8 rounded-full bg-color6 text-white flex items-center justify-center">
              {msgObj.nickname.charAt(0)}
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-1 text-xs max-w-xs">
          {msgObj.userId !== userId && (
            <div className="text-gray-600">
              {msgObj.nickname}
            </div>
          )}
          <div className={`px-4 py-2 rounded-lg inline-block ${msgObj.userId === userId ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            {msgObj.message}
          </div>
          <div className="text-gray-500 mt-1">
            {messageTime}
          </div>
        </div>
        {msgObj.userId === userId && (
          <div className="flex flex-col items-center ml-2">
            <div className="w-8 h-8 rounded-full bg-color6 text-white flex items-center justify-center">
              {msgObj.nickname.charAt(0)}
            </div>
          </div>
        )}
      </div>
    );
  });
  
  return (
    <div className="bg-white flex flex-col w-full h-full relative">
      {!isConnected && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg">연결 중...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="pl-2 pr-6 py-2 border w-full flex flex-col h-full">
        <div className="flex-1 p-2 border rounded-xl overflow-y-auto no-scrollbar">
          <div className="flex flex-col space-y-4 p-2">
            {messagesList}
          </div>
        </div>
        <div className="flex-none bg-white py-3 pr-2">
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 py-2 px-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="여기에 메시지를 입력하세요..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="p-2 bg-cyan-500 text-white rounded w-10"
              onClick={sendMessage}
              disabled={!isConnected}
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
