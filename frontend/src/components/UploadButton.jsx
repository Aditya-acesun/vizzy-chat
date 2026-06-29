export default function UploadButton({ onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onUpload({
        file,
        base64: reader.result,
        name: file.name,
        type: file.type
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <label className="cursor-pointer text-zinc-400 hover:text-zinc-200 transition p-2 rounded-lg hover:bg-zinc-800">
      <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    </label>
  )
}