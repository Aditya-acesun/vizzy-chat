import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import MessageBubble from './MessageBubble'

const SUGGESTIONS = [
  "Paint something that feels like how my last year felt",
  "Create a dreamlike forest at midnight",
  "Generate a premium product poster for a luxury watch",
  "Animate a glowing particle effect",
  "Write a caption for a coastal restaurant",
]

export default function ChatWindow() {
  const { messages, status, sendMessage, isConnected } = useChatStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center mt-16">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <span className="text-violet-400 text-2xl">✦</span>
            </div>
            <div className="absolute -inset-2 rounded-2xl bg-violet-500/10 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-200 mb-2">What would you like to create?</h2>
          <p className="text-sm text-zinc-500 mb-8">Paint · Animate · Visualize · Write</p>
          <div className="flex flex-col gap-2 w-full max-w-md">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => isConnected && sendMessage(s)}
                className="text-left text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/50 rounded-xl px-4 py-2.5 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {status && (
        <div className="flex justify-start mb-4">
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
            {status}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}