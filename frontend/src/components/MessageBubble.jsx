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
      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-lg px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
    >
      ↓ Save
    </button>
  )
}

function ImageCard({ url, prompt, fallbackSeed = 9999 }) {
  const [loaded, setLoaded] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [currentUrl, setCurrentUrl] = useState(url)

  const fallbacks = [
    url,
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${fallbackSeed}&model=turbo`,
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
    <div className="relative group rounded-xl overflow-hidden bg-zinc-800 min-h-[200px] flex items-center justify-center">
      {!loaded && (
        <div className="text-zinc-500 text-xs animate-pulse">Loading...</div>
      )}
      <img
        src={currentUrl}
        alt={prompt}
        className={`w-full rounded-xl transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
      {loaded && <DownloadButton url={currentUrl} prompt={prompt} />}
    </div>
  )
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (message.type === 'image_grid') {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[90%]">
          <div className="grid grid-cols-2 gap-2">
            {message.images?.map((img, i) => (
              <ImageCard
                key={img.id}
                url={img.url}
                prompt={img.prompt}
                fallbackSeed={i * 3333}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2 ml-1">"{message.prompt}"</p>
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
          <p className="text-xs text-zinc-500 mt-2 ml-1">"{message.prompt}"</p>
        </div>
      </div>
    )
  }
  if (message.type === 'image_prompt' && message.role === 'user') {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[75%] flex flex-col items-end gap-2">
        {message.previewUrl && (
          <img
            src={message.previewUrl}
            alt="uploaded"
            className="h-32 rounded-xl border border-zinc-700"
          />
        )}
        <div className="bg-violet-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm">
          {message.content}
        </div>
      </div>
    </div>
  )
}
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-violet-600 text-white rounded-br-sm'
          : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
      }`}>
        {message.content}
      </div>
    </div>
  )
}