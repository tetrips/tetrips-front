'use client'
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="bg-white flex flex-col px-2 w-full h-full">
      <div className="pt-5 px-4 border w-full flex flex-col h-full">
        <div className="flex-1 py-2 border rounded-xl overflow-y-auto no-scrollbar custom-scrollbar">
          <div className="flex flex-col space-y-4 p-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${index % 2 === 0 ? 'items-end' : 'items-start'}`}>
                  <div>
                    <span className={`px-4 py-2 rounded-xl inline-block ${index % 2 === 0 ? 'bg-color2' : 'bg-color10'}`}>
                      {message}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white py-3">
          <div className="flex items-center">
            <input
              className="flex-1 text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="여기에 메시지를 입력하세요..."
            />
            <button
              className="ml-2 w-20 h-10 text-sm bg-color7 text-white rounded flex items-center justify-center"
              onClick={handleSend}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>


  );
}