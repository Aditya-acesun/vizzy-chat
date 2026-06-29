import { create } from 'zustand'

let ws = null

export const useChatStore = create((set, get) => ({
  messages: [],
  status: null,
  isConnected: false,
  multiMode: false,
  uploadedImage: null,
  sessionId: crypto.randomUUID(),

  toggleMulti: () => set((state) => ({ multiMode: !state.multiMode })),

  setUploadedImage: (img) => set({ uploadedImage: img }),
  clearUploadedImage: () => set({ uploadedImage: null }),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  })),

  sendMessage: (text) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    const { multiMode, uploadedImage } = get()

    // show user message with image preview if uploaded
    get().addMessage({
      role: 'user',
      type: uploadedImage ? 'image_prompt' : 'text',
      content: text,
      previewUrl: uploadedImage?.base64 || null,
      id: crypto.randomUUID()
    })

    ws.send(JSON.stringify({
      message: text,
      multi: multiMode,
      image: uploadedImage?.base64 || null
    }))

    // clear uploaded image after sending
    set({ uploadedImage: null })
  },

  initSocket: () => {
    const { sessionId } = get()
    if (ws && ws.readyState === WebSocket.OPEN) return

    ws = new WebSocket(`ws://localhost:8888/ws/chat/${sessionId}`)

    ws.onopen = () => {
      console.log('WS connected')
      set({ isConnected: true })
    }

    ws.onclose = () => {
      console.log('WS disconnected')
      set({ isConnected: false })
      setTimeout(() => get().initSocket(), 2000)
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.type === 'status') {
        set({ status: data.content })
      } else if (data.type === 'done') {
        set({ status: null })
        get().addMessage({
          ...data,
          type: data.content_type || 'text',
          role: 'assistant',
          id: data.id || crypto.randomUUID()
        })
      }
    }

    ws.onerror = (e) => console.error('WS error:', e)
  }
}))