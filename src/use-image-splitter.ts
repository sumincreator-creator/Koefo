import { useState, useCallback } from 'react';
import JSZip from 'jszip';

interface ImageDimensions {
  width: number;
  height: number;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  // Wait long enough for the browser to pick up the download before revoking
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);
}

export function useImageSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [splitCount, setSplitCount] = useState<number>(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSliced, setHasSliced] = useState(false);

  const handleUpload = useCallback((uploadedFile: File) => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const objectUrl = URL.createObjectURL(uploadedFile);

    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setOriginalImage(img);
      setFile(uploadedFile);
      setImageUrl(objectUrl);
      setHasSliced(false);

      const ratio = img.naturalWidth / img.naturalHeight;
      const suggestedCount = Math.max(2, Math.min(10, Math.round(ratio)));
      if (Math.abs(suggestedCount - ratio) < 0.2) {
        setSplitCount(suggestedCount);
      }
    };
  }, [imageUrl]);

  const clear = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(null);
    setImageUrl(null);
    setOriginalImage(null);
    setDimensions(null);
    setSplitCount(3);
    setHasSliced(false);
  }, [imageUrl]);

  const generateSlice = (img: HTMLImageElement, index: number, total: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get canvas context'));

      const sliceWidth = Math.floor(img.naturalWidth / total);
      canvas.width = sliceWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(
        img,
        index * sliceWidth, 0, sliceWidth, img.naturalHeight,
        0, 0, sliceWidth, img.naturalHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob failed'));
        },
        'image/jpeg',
        1.0
      );
    });
  };

  const downloadZip = async () => {
    if (!originalImage || !file) return;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      const blobs = await Promise.all(
        Array.from({ length: splitCount }).map((_, i) =>
          generateSlice(originalImage, i, splitCount)
        )
      );

      blobs.forEach((blob, i) => {
        const slideNum = String(i + 1).padStart(2, '0');
        zip.file(`${baseName}-slide-${slideNum}.jpg`, blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      triggerDownload(url, `${baseName}-carousel-${splitCount}.zip`);
      setHasSliced(true);
    } catch (err) {
      console.error('Failed to generate zip file', err);
      alert('Something went wrong while generating your images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSlide = async (index: number) => {
    if (!originalImage || !file) return;
    try {
      const blob = await generateSlice(originalImage, index, splitCount);
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const slideNum = String(index + 1).padStart(2, '0');
      triggerDownload(url, `${baseName}-slide-${slideNum}.jpg`);
    } catch (err) {
      console.error('Failed to download slide', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return {
    file,
    imageUrl,
    dimensions,
    splitCount,
    setSplitCount,
    isProcessing,
    hasSliced,
    handleUpload,
    clear,
    downloadZip,
    downloadSlide,
  };
}
