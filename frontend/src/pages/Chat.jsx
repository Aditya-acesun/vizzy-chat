import { useEffect, useState } from 'react'
import { useChatStore } from '../store/chatStore'
import ChatWindow from '../components/ChatWindow'
import UploadButton from '../components/UploadButton'

export default function Chat() {
  const {
    initSocket, sendMessage, isConnected,
    multiMode, toggleMulti,
    uploadedImage, setUploadedImage, clearUploadedImage
  } = useChatStore()
  const [input, setInput] = useState('')

  useEffect(() => { initSocket() }, [])

  const handleSend = () => {
    if (!input.trim() || !isConnected) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-xl">✦</span>
          <span className="font-semibold text-lg">Vizzy</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMulti}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              multiMode
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            {multiMode ? '✦ 2 variants ON' : '2 variants'}
          </button>
          <div className={`text-xs px-2 py-1 rounded-full ${
            isConnected ? 'bg-green-900 text-green-400' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {isConnected ? 'connected' : 'connecting...'}
          </div>
        </div>
      </div>

      <ChatWindow />

      {/* Image preview above input */}
      {uploadedImage && (
        <div className="px-4 pt-2">
          <div className="relative inline-block">
            <img
              src={uploadedImage.base64}
              alt="upload preview"
              className="h-20 w-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={clearUploadedImage}
              className="absolute -top-2 -right-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Image attached — describe what to do with it</p>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-zinc-800">
        <div className="flex items-end gap-2 bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-700 focus-within:border-violet-500 transition">
          <UploadButton onUpload={setUploadedImage} />
          <textarea
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none outline-none max-h-32"
            placeholder={
              uploadedImage
                ? "Describe what to do with this image..."
                : multiMode
                ? "Describe what you want — I'll generate 2 variants..."
                : "Paint something that feels like how my last year felt..."
            }
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-medium transition"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-zinc-600 text-center mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}