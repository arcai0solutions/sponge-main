"use client";

import { useState, useEffect } from "react";

export const useImagePreloader = (images: string[]) => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const total = images.length;

    if (total === 0) {
      setLoaded(true);
      return;
    }

    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };

    const loadAll = async () => {
      try {
        const promises = images.map(async (src) => {
          await loadImage(src);
          loadedCount++;
          setProgress(Math.round((loadedCount / total) * 100));
        });

        await Promise.all(promises);
        setLoaded(true);
      } catch (error) {
        console.error("Failed to load images", error);
        // Even if some fail, we might want to continue or handle error
        setLoaded(true); 
      }
    };

    loadAll();
  }, [images]);

  return { loaded, progress };
};
