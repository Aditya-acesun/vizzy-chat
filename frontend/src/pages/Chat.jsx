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
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <span className="text-violet-400 text-sm">✦</span>
          </div>
          <div>
            <span className="font-semibold text-zinc-100">Vizzy</span>
            <span className="text-zinc-500 text-xs ml-2">AI Creative Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMulti}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
              multiMode
                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            {multiMode ? '✦ 2 variants' : '2 variants'}
          </button>
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            {isConnected ? 'live' : 'connecting'}
          </div>
        </div>
      </div>

      <ChatWindow />

      {/* Image preview */}
      {uploadedImage && (
        <div className="px-4 pt-2 pb-1">
          <div className="relative inline-block">
            <img
              src={uploadedImage.base64}
              alt="upload preview"
              className="h-16 w-16 object-cover rounded-xl border border-violet-500/50"
            />
            <button
              onClick={clearUploadedImage}
              className="absolute -top-1.5 -right-1.5 bg-zinc-700 hover:bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Image attached — describe what to do with it</p>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-5 pt-2 border-t border-zinc-800/50">
        <div className="flex items-end gap-2 bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-800 focus-within:border-violet-500/50 transition-all duration-200 shadow-lg">
          <UploadButton onUpload={setUploadedImage} />
          <textarea
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 resize-none outline-none max-h-32 leading-relaxed"
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
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-zinc-700 text-center mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}