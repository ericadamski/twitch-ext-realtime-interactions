import { until } from "@open-draft/until";

import { getLatestActiveTwitchToken, addNewTwitchToken } from "lib/supabase";
import { getAppAccessToken } from "lib/twitch";

export async function getActiveTwitchToken() {
  const [tokenGetError, token] = await until(() =>
    getLatestActiveTwitchToken()
  );

  if (tokenGetError != null || token == null) {
    const [tokenCreateError, authData] = await until(() => getAppAccessToken());

    if (tokenCreateError != null || authData == null) {
      return undefined;
    }

    await addNewTwitchToken(authData.token, authData.expiresIn);

    return authData.token;
  }

  return token;
}
