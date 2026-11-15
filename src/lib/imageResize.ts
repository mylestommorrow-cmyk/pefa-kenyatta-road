/**
 * Client-side automatic image resizing & WebP compression using Canvas.
 * Keeps uploads lightweight for Kenyan mobile data connections.
 */
export async function resizeImageFile(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<{blob: Blob; dataUrl: string; width: number; height: number; mimeType: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported image format.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        const supportsWebp = webpDataUrl.startsWith('data:image/webp');
        const mimeType = supportsWebp ? 'image/webp' : 'image/jpeg';
        const finalDataUrl = supportsWebp ? webpDataUrl : canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image.'));
              return;
            }
            resolve({blob, dataUrl: finalDataUrl, width, height, mimeType});
          },
          mimeType,
          quality
        );
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
