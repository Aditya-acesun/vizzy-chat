import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import MessageBubble from './MessageBubble'

export default function ChatWindow() {
  const { messages, status } = useChatStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 mt-24">
          <div className="text-5xl mb-4">✦</div>
          <p className="text-lg font-medium text-zinc-300">What would you like to create?</p>
          <p className="text-sm mt-2">Paint a feeling · Transform a photo · Generate a story</p>
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {status && (
        <div className="flex justify-start mb-4">
          <div className="bg-zinc-800 text-zinc-400 text-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
            <span className="animate-pulse">●</span> {status}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}