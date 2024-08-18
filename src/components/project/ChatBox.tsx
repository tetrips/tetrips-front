'use client'
import { ClientProject, Guest } from '@/types/Project'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef, useCallback } from 'react'
import { noto } from '../common/fonts'
import { Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { generateColorFromEmail, getContrastColor } from '@/utils/userColor'

interface Message {
  nickname: string
  message: string
  userId: string
  prId: string
  chatTime: Date
}

interface ClientMessage {
  nickname: string
  message: string
  userId: string
  prId: string
  timestamp?: Date
}

export default function ChatBox({
  project,
  userData,
}: {
  project: ClientProject
  userData: Guest
}) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ClientMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const stompClientRef = useRef<any>(null)
  const projectId = project.id
  const userId = userData.email
  const chatUserId = userId.replace('@', '-')
  const nickname = userData.nickname

  const fetchMessages = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_CHAT_URL) {
      console.error('NEXT_PUBLIC_CHAT_URL is not defined')
      setError('서버 설정 오류가 발생했습니다.')
      return
    }
    try {
      const response = await fetch(
        `https://chat.tetrips.co.kr/api/messages/${projectId}`,
      )
      if (!response.ok) {
        throw new Error('메시지를 불러오지 못했습니다.')
      }
      const data: Message[] = await response.json()
      //console.log('fetch messages data', data);
      const clientData = data.map((msg) => {
        const originalUserId = msg.userId.replace('-', '@')
        return {
          nickname: msg.nickname,
          message: msg.message,
          userId: originalUserId,
          prId: msg.prId,
          timestamp: new Date(msg.chatTime),
        }
      })
      setMessages(clientData)
    } catch (error) {
      setError('메시지를 불러오는 중 오류가 발생했습니다.')
      console.error('Error fetching messages:', error)
    }
  }, [projectId])

  const sendMessage = useCallback(async () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      setError('WebSocket 연결이 활성화되지 않았습니다.')
      return
    }
    if (input.trim()) {
      const newMessage = {
        nickname,
        message: input.trim(),
        userId: chatUserId,
        prId: projectId,
      }

      try {
        stompClientRef.current.send('/app/send', {}, JSON.stringify(newMessage))
        const originalUserId = newMessage.userId.replace('-', '@')
        const transformMessage = {
          nickname: newMessage.nickname,
          message: newMessage.message,
          userId: originalUserId,
          prId: newMessage.prId,
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...transformMessage,
            timestamp: new Date(),
          },
        ])

        setInput('')
      } catch (error) {
        setError('메시지 전송 중 오류가 발생했습니다.')
        console.error('Error sending message:', error)
      }
    }
  }, [input, nickname, chatUserId, projectId])

  useEffect(() => {
    fetchMessages()

    const socket = new SockJS('https://chat.tetrips.co.kr/chat')
    const stompClient = Stomp.over(socket)

    stompClient.connect(
      {},
      () => {
        stompClient.subscribe(
          `/topic/messages/${projectId}/${chatUserId}`,
          (message) => {
            const newMessage: Message = JSON.parse(message.body)
            //console.log('Received new message:', newMessage);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                nickname: newMessage.nickname,
                message: newMessage.message,
                userId: newMessage.userId.replace('-', '@'),
                prId: newMessage.prId,
                timestamp: new Date(newMessage.chatTime),
              },
            ])
          },
        )
      },
      (error: any) => {
        console.error('WebSocket error:', error)
        setError('WebSocket 오류가 발생했습니다.')
      },
    )

    stompClientRef.current = stompClient

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect()
      }
    }
  }, [projectId, chatUserId, fetchMessages])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const getUserColors = useCallback((email: string) => {
    const backgroundColor = generateColorFromEmail(email)
    const textColor = getContrastColor(backgroundColor)
    return { backgroundColor, textColor }
  }, [])

  const messagesList = messages.map((msgObj, index) => {
    const messageTime = msgObj.timestamp
      ? msgObj.timestamp.toLocaleString()
      : ''
    const { backgroundColor, textColor } = getUserColors(msgObj.userId)

    return (
      <div
        key={`${index}-${msgObj.userId}`}
        className={`flex ${msgObj.userId === userId ? 'justify-end' : 'justify-start'}`}
      >
        {msgObj.userId !== userId && (
          <div className="mr-2 flex flex-col items-center">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ backgroundColor, color: textColor }}
            >
              {msgObj.nickname.charAt(0)}
            </div>
          </div>
        )}
        <div
          className={`${noto.className} flex max-w-xs flex-col space-y-1 text-xs font-bold`}
        >
          {msgObj.userId !== userId && (
            <div className="text-gray-600">{msgObj.nickname}</div>
          )}
          <div
            className={`${noto.className} inline-block rounded-lg px-4 py-2 ${msgObj.userId === userId ? 'bg-sky-300 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            {msgObj.message}
          </div>
          <div className="mt-1 text-gray-500">{messageTime}</div>
        </div>
        {msgObj.userId === userId && (
          <div className="ml-2 flex flex-col items-center">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ backgroundColor, color: textColor }}
            >
              {msgObj.nickname.charAt(0)}
            </div>
          </div>
        )}
      </div>
    )
  })

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="flex h-full w-full flex-col border py-2 pl-2 pr-6">
        <div
          ref={chatContainerRef}
          className="no-scrollbar flex-1 overflow-y-auto rounded-xl border p-2"
        >
          <div className="flex flex-col space-y-4 p-2">{messagesList}</div>
        </div>
        <div className="flex-none bg-white py-1 pr-1">
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 rounded-lg border px-1 py-2 text-xs focus:outline-none"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="여기에 메시지를 입력하세요..."
              onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
              autoComplete="off"
            />
            <button
              className="flex h-8 w-8 items-center justify-center rounded bg-cyan-500 p-2 text-white"
              onClick={sendMessage}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
