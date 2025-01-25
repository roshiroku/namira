import ImageType from '../ImageType';

export const compareImages = async (data1: ImageData, data2: ImageData): Promise<number> => {
  try {
    const data1Pixels = data1.data;
    const data2Pixels = data2.data;

    // Calculate the pixel difference
    let diff = 0;
    for (let i = 0; i < data1Pixels.length; i += 4) {
      const rDiff = Math.abs(data1Pixels[i] - data2Pixels[i]);
      const gDiff = Math.abs(data1Pixels[i + 1] - data2Pixels[i + 1]);
      const bDiff = Math.abs(data1Pixels[i + 2] - data2Pixels[i + 2]);

      diff += (rDiff + gDiff + bDiff) / (255 * 3);
    }

    const totalPixels = data1Pixels.length / 4;
    return diff / totalPixels; // Return a number between 0 and 1
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
};

export const estimateFileSize = (src: string): number => src.length * (3 / 4);

export const inferImageType = (src: string): ImageType => {
  const extension = src.split('.').pop()?.toLowerCase();

  if (extension) {
    if (extension === 'jpg') {
      return ImageType.JPEG;
    }
    return `image/${extension}` as ImageType;
  } else if (src.startsWith('data:')) {
    return src.substring(5, src.indexOf(';')) as ImageType;
  } else {
    return ImageType.None;
  }
};
