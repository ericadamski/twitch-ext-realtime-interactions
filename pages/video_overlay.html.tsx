import { RoomServiceProvider } from "@roomservice/react";
import styled from "styled-components";

import { useTwitchUser } from "hooks/useTwitchUser";
import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";
import { until } from "@open-draft/until";
import { Cursors } from "components/Cursors";
import { useTwitchChannel } from "hooks/useTwitchChannel";

export default function Panel() {
  const user = useTwitchUser();
  const channelId = useTwitchChannel();

  return (
    <RoomServiceProvider
      online={user?.id != null}
      clientParameters={{
        auth: authRoomService,
        ctx: { user },
      }}
    >
      <Overlay>{channelId && <Cursors channelId={channelId} />}</Overlay>
    </RoomServiceProvider>
  );
}

async function authRoomService(params: {
  room: string;
  ctx: {
    user: TwitchUser | AnonymousTwitchUser;
  };
}) {
  const [requestError, response] = await until(() =>
    fetch("/api/room-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        room: params.room,
        user: params.ctx.user,
      }),
    })
  );

  if (requestError != null || !response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized!");
    }

    if (response.status !== 200) {
      throw await response.text();
    }
  }

  const [parseError, data] = await until(() => response.json());

  if (parseError != null || data == null) {
    throw new Error("Unable to connect to room");
  }

  return {
    user: data.user,
    resources: data.resources,
    token: data.token,
  };
}

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
`;
