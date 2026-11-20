const MAX_IMAGE_SIZE = 1600

function readRaw(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  const raw = await readRaw(file)
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return raw

  const image = new Image()
  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
    image.src = raw
  })

  const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height)

  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const result = canvas.toDataURL(type, 0.85)
  return result.length < raw.length ? result : raw
}
