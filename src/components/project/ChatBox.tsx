'use client';

import { ClientProject, Guest } from '@/types/Project';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef, useCallback } from 'react';
import { noto } from '../common/fonts';

interface Message {
  nickname: string;
  message: string;
  userId: string;
  prId: string;
  timestamp: string;
}

export default function ChatBox({ project, userData }: { project: ClientProject, userData: Guest }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const projectId = project.id;
  const guests = project.guests;
  const userId = userData.email;
  const nickname = userData.nickname;


  const fetchMessages = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_CHAT_API_URL) {
      console.error('NEXT_PUBLIC_CHAT_API_URL is not defined');
      setError('서버 설정 오류가 발생했습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/messages/${projectId}`);
      if (!response.ok) {
        throw new Error('메시지를 불러오지 못했습니다.');
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      setError('메시지를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const sendMessage = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_CHAT_API_URL) {
      console.error('NEXT_PUBLIC_CHAT_API_URL is not defined');
      setError('서버 설정 오류가 발생했습니다.');
      return;
    }

    if (input.trim()) {
      setIsLoading(true);
      const newMessage = {
        nickname,
        message: input.trim(),
        userId,
        prId: projectId,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error('메시지를 전송하지 못했습니다.');
        }

        setInput('');
        await fetchMessages();
      } catch (error) {
        setError('메시지 전송 중 오류가 발생했습니다.');
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [input, nickname, userId, projectId, fetchMessages]);

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getUserColor = useCallback((email: string) => {
    const colors = ['bg-sky-300', 'bg-rose-300', 'bg-green-300', 'bg-purple-300', 'bg-yellow-300','bg-pink-300','bg-orange-300','bg-violet-300','bg-indigo-300','bg-blueGray-300'];
    const guestIndex = guests.findIndex(guest => guest.email === email);
    return colors[guestIndex % colors.length];
  }, [guests]);

  const messagesList = messages.map((msgObj, index) => {
    const messageTime = new Date(msgObj.timestamp).toLocaleString();
    const userColor = getUserColor(msgObj.userId);

    return (
      <div key={`${msgObj.userId}-${msgObj.timestamp}`} className={`flex ${msgObj.userId === userId ? 'justify-end' : 'justify-start'}`}>
        {msgObj.userId !== userId && (
          <div className="flex flex-col items-center mr-2">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${userColor}`}>
              {msgObj.nickname.charAt(0)}
            </div>
          </div>
        )}
        <div className={`${noto.className} flex flex-col font-bold space-y-1 text-xs max-w-xs`}>
          {msgObj.userId !== userId && (
            <div className="text-gray-600">
              {msgObj.nickname}
            </div>
          )}
          <div className={`${noto.className} px-4 py-2 rounded-lg inline-block ${msgObj.userId === userId ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
            {msgObj.message}
          </div>
          <div className="text-gray-500 mt-1">
            {messageTime}
          </div>
        </div>
        {msgObj.userId === userId && (
          <div className="flex flex-col items-center ml-2">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${userColor}`}>
              {msgObj.nickname.charAt(0)}
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="bg-white flex flex-col w-full h-full relative">
      {/* {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg">로딩 중...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )} */}
      <div className="pl-2 pr-6 py-2 border w-full flex flex-col h-full">
        <div ref={chatContainerRef} className="flex-1 p-2 border rounded-xl overflow-y-auto no-scrollbar">
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
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              disabled={isLoading}
            />
            <button
              className={`p-2 bg-cyan-500 text-white rounded w-10 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={sendMessage}
              disabled={isLoading}
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

