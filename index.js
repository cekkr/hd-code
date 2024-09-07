const fs = require('fs');
const jimp = require('jimp');

async function createBitImage(filePath, imageWidth, pixelSize) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
  
      // Calculate image dimensions based on file size and pixel size
      const totalPixels = fileBuffer.length * 8; // Each byte has 8 bits
      const imageHeight = Math.ceil(totalPixels / imageWidth) * pixelSize;
      imageWidth = imageWidth * pixelSize;
  
      const borderSize = pixelSize * 2;
  
      // Add space for the border
      const borderedImageWidth = imageWidth + (2 * borderSize);
      const borderedImageHeight = imageHeight + (2  * borderSize);
  
      const image = new jimp.Jimp({ width: borderedImageWidth, height: borderedImageHeight, color: 'white' });
  
      let bitIndex = 0;
      for (let byte of fileBuffer) {
        // Iterate through all bits in a byte
        for (let i = 0; i < 8; i++) { 
          const bit = (byte >> (7 - i)) & 1;
  
          // Ensure x coordinate stays within the image bounds (excluding the right border)
          const x = (bitIndex % (imageWidth / pixelSize)) * pixelSize + borderSize
          const y = Math.floor(bitIndex / (imageWidth / pixelSize)) * pixelSize + borderSize;

          if (y >= borderedImageHeight)
            console.log(`Warning: Bit index ${bitIndex} out of bounds for image height ${y} > ${borderedImageHeight}`)
  
          if (bit === 1) {
            for (let px = 0; px < pixelSize; px++) {
              for (let py = 0; py < pixelSize; py++) {
                image.setPixelColor(0x000000FF, x + px, y + py);
              }
            }
          }
  
          bitIndex++;
        }
      }
  
      if (true) {
        // Draw the dotted border
        for (let i = 0; i < borderedImageWidth; i += 2 * borderSize) {
          for (let j = 0; j < borderedImageHeight; j += 2 * borderSize) {
            for (let px = 0; px < borderSize; px++) {
              for (let py = 0; py < borderSize; py++) {
                if (
                  (j < borderSize || j >= borderedImageHeight - (borderSize+1)) ||
                  (i < borderSize || i >= borderedImageWidth - (borderSize+1))
                ) {
                  const x = i + px
                  const y = j + py
                  image.setPixelColor(0x000000FF, x, y);
                }
              }
            }
          }
        }
      }
  
      await image.write('bit_image.png');
      console.log('Bit image created successfully!');
    } catch (error) {
      console.error('Error creating bit image:', error);
    }
  }

// Example usage
createBitImage('pdf.7z', 200, 4); // Adjust width as needed