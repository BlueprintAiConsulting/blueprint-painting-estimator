export async function countWhitePixels(base64Mask: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to get canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let whiteCount = 0;

      // Iterate through pixels (rgba: 4 bytes per pixel)
      for (let i = 0; i < data.length; i += 4) {
        // A white pixel in our mask should be #FFFFFF
        // Let's accept anything very bright as white to account for compression artifacts
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
          whiteCount++;
        }
      }

      resolve(whiteCount);
    };
    img.onerror = () => reject('Failed to load mask image for pixel counting');
    img.src = base64Mask;
  });
}
