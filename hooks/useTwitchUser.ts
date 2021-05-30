import { useState, useEffect } from "react";
import useSWR from "swr";

import { useTwitch } from "./useTwitch";
import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";
import { until } from "@open-draft/until";

async function fetcher(
  route: string,
  token: Twitch.ext.Authorized["token"],
  userId: Twitch.ext.Authorized["userId"]
): Promise<TwitchUser | AnonymousTwitchUser | undefined> {
  if (token == null || userId == null) {
    throw new Error("Cannot fetch without arguments.");
  }

  const [fetchError, response] = await until(() =>
    fetch(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, oId: userId }),
    })
  );

  if (fetchError != null || !response.ok) {
    return undefined;
  }

  const [parseError, user] = await until(() => response.json());

  if (parseError != null) {
    return undefined;
  }

  return user;
}

export function useTwitchUser() {
  const twitch = useTwitch();
  const [auth, setAuth] = useState<Twitch.ext.Authorized | null>(null);
  const { data: user } = useSWR(
    ["/api/user/auth", auth?.token, auth?.userId],
    fetcher
  );

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized(setAuth);
    }
  }, [twitch]);

  return user;
}
