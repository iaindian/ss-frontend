// lib/facecheck.ts
export async function hasFaceInImage(file: File): Promise<boolean> {
  // Best-effort: if FaceDetector is available, use it; otherwise return true to not block.
  // @ts-ignore
  const FaceDetectorCtor = (window as any).FaceDetector
  if (!FaceDetectorCtor) return true
  try {
    // @ts-ignore
    const detector = new FaceDetectorCtor({ fastMode: true })
    const bmp = await createImageBitmap(file)
    const canvas = new OffscreenCanvas(bmp.width, bmp.height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bmp, 0, 0)
    // @ts-ignore
    const faces = await detector.detect(canvas)
    return (faces?.length || 0) > 0
  } catch {
    return true
  }
}