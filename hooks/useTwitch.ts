import { useState, useEffect } from "react";

export function useTwitch() {
  const [ext, setExt] = useState<typeof Twitch.ext | null>(null);

  useEffect(() => {
    const isServerSide = typeof window === "undefined";
    if (!isServerSide && window.Twitch) {
      setExt(window.Twitch.ext);
    }
  }, []);

  return ext;
}
