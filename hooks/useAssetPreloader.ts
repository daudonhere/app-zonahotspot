"use client";
import { useEffect, useState } from "react";
export type Asset = {
  type: "font";
  path: string;
  fontFamily?: string;
};
const preloadFont = async (path: string, family: string) => {
  const font = new FontFace(family, `url(${path})`);
  const loaded = await font.load();
  document.fonts.add(loaded);
};
export const useAssetPreloader = (assets: Asset[]) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  useEffect(() => {
    if (isPreloaded) return;
    Promise.all(
      assets.map((a) =>
        a.type === "font" && a.fontFamily
          ? preloadFont(a.path, a.fontFamily)
          : Promise.resolve(),
      ),
    ).finally(() => setIsPreloaded(true));
  }, [assets, isPreloaded]);
  return { isPreloaded };
};
