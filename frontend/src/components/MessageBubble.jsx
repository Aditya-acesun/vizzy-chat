import { useState } from 'react'

function DownloadButton({ url, prompt }) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = url
    a.download = `vizzy-${prompt?.slice(0, 20).replace(/\s+/g, '-') || 'image'}.jpg`
    a.target = '_blank'
    a.click()
  }
  return (
    <button
      onClick={handleDownload}
      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-lg px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
    >
      ↓ Save
    </button>
  )
}

function LoadingCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-zinc-900 min-h-[250px] flex items-center justify-center border border-zinc-800">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping" />
          <div className="absolute inset-1 rounded-full border-2 border-t-violet-400 border-violet-800 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-violet-500/20 animate-pulse" />
        </div>
        <p className="text-zinc-500 text-xs tracking-widest uppercase animate-pulse">Creating</p>
      </div>
    </div>
  )
}

function ImageCard({ url, prompt, fallbackSeed = 9999 }) {
  const [loaded, setLoaded] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [currentUrl, setCurrentUrl] = useState(url)

  const fallbacks = [
    url,
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&seed=${fallbackSeed}&model=turbo`,
    `https://picsum.photos/seed/${fallbackSeed}/512/512`
  ]

  const handleError = () => {
    const next = attempts + 1
    if (next < fallbacks.length) {
      setAttempts(next)
      setCurrentUrl(fallbacks[next])
    }
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-zinc-900 min-h-[250px] flex items-center justify-center border border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
      {!loaded && <LoadingCard />}
      <img
        src={currentUrl}
        alt={prompt}
        className={`w-full rounded-2xl transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 absolute scale-95'}`}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
      {loaded && <DownloadButton url={currentUrl} prompt={prompt} />}
      {loaded && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <p className="text-xs text-zinc-300 truncate">"{prompt}"</p>
        </div>
      )}
    </div>
  )
}

function VideoCard({ url, prompt }) {
  return (
    <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
      <video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-2xl"
        onError={(e) => {
          e.target.parentElement.innerHTML = `
            <div class="bg-zinc-900 rounded-2xl p-6 text-center border border-zinc-800">
              <div class="text-4xl mb-2">🎬</div>
              <p class="text-zinc-400 text-sm">Video generated</p>
              <a href="${url}" target="_blank" class="text-violet-400 text-xs mt-2 block hover:underline">Open video ↗</a>
            </div>
          `
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-xs text-zinc-300 truncate">"{prompt}"</p>
      </div>
    </div>
  )
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (message.type === 'image_prompt' && isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] flex flex-col items-end gap-2">
          {message.previewUrl && (
            <img src={message.previewUrl} alt="uploaded" className="h-32 rounded-xl border border-zinc-700" />
          )}
          <div className="bg-violet-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm">
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  if (message.type === 'video') {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[75%]">
          <VideoCard url={message.video_url} prompt={message.prompt} />
        </div>
      </div>
    )
  }

  if (message.type === 'image_grid') {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[90%]">
          <div className="grid grid-cols-2 gap-3">
            {message.images?.map((img, i) => (
              <ImageCard key={img.id} url={img.url} prompt={img.prompt} fallbackSeed={i * 3333} />
            ))}
          </div>
          {message.enhanced_prompt && message.enhanced_prompt !== message.prompt && (
            <p className="text-xs text-violet-400/60 mt-2 ml-1 italic">✦ enhanced: "{message.enhanced_prompt?.slice(0, 80)}..."</p>
          )}
        </div>
      </div>
    )
  }

  if (message.type === 'image') {
    const imgUrl = message.images?.[0]?.url || message.content
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[75%]">
          <ImageCard url={imgUrl} prompt={message.prompt} fallbackSeed={9999} />
          {message.enhanced_prompt && message.enhanced_prompt !== message.prompt && (
            <p className="text-xs text-violet-400/60 mt-2 ml-1 italic">✦ enhanced: "{message.enhanced_prompt?.slice(0, 80)}..."</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-violet-600 text-white rounded-br-sm'
          : 'bg-zinc-900 text-zinc-100 rounded-bl-sm border border-zinc-800'
      }`}>
        {message.content}
      </div>
    </div>
  )
}