'use client';

import { Guest } from '@/types/Project';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  nickname: string;
  message: string;
  userId: string;
  prId: string;
  timestamp: string;
}

export default function ChatBox({ projectId, userData }: { projectId: string, userData: Guest }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const userId = userData.email;
  const nickname = userData.nickname;

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${projectId}`);
      if (!response.ok) {
        throw new Error('메시지를 불러오지 못했습니다.');
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error: any) {
      setError(error.message);
    }
  }, [projectId]);


  const sendMessage = useCallback(async () => {
    if (input.trim()) {
      const newMessage = {
        nickname,
        message: input.trim(),
        userId,
        prId: projectId,
      };

      try {
        const response = await fetch('http://localhost:8080/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error('메시지를 전송하지 못했습니다.');
        }

        const savedMessage: Message = await response.json();
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
        setInput('');
      } catch (error:any) {
        setError(error.message);
      }
    }
  }, [input, nickname, userId, projectId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const messagesList = messages.map((msgObj, index) => {
    const messageTime = new Date(msgObj.timestamp).toLocaleString();

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
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

