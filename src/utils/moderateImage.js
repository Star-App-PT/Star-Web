export async function moderateImage(file) {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY
  if (!apiKey) return { safe: true }

  try {
    const base64 = await fileToBase64(file)
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: 'SAFE_SEARCH_DETECTION' }],
          }],
        }),
      }
    )
    const data = await res.json()
    const annotation = data.responses?.[0]?.safeSearchAnnotation
    if (!annotation) return { safe: true }

    const flagged = ['LIKELY', 'VERY_LIKELY']
    if (flagged.includes(annotation.adult) || flagged.includes(annotation.violence)) {
      return { safe: false, reason: 'Image flagged as inappropriate.' }
    }
    return { safe: true }
  } catch {
    return { safe: true }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
