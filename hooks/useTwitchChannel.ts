import { useEffect, useState } from "react";

import { useTwitch } from "./useTwitch";

// N.B Right now we can pull the channel off of the helpers
// in future we might want to combine that with a request to the
// Twitch API to fill in some extra info
export function useTwitchChannel() {
  const twitch = useTwitch();
  const [channelId, setChannelId] = useState<string | null>(null);

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized(({ channelId }) => setChannelId(channelId));
    }
  }, [twitch]);

  return channelId;
}
