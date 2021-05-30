import React, { useEffect, useRef } from "react";
import { useMap } from "@roomservice/react";
import styled from "styled-components";

import { useTwitchUser } from "hooks/useTwitchUser";
import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";
import { Position, useUserCursor } from "hooks/useUserCursor";

interface Props {
  channelId: string;
}

interface UserCursor {
  user: TwitchUser | AnonymousTwitchUser;
  position: Position;
}

export function Cursors(props: Props) {
  const mousePadRef = useRef<HTMLDivElement>(null);
  const user = useTwitchUser();
  const [mousePosition, hideMouse] = useUserCursor(mousePadRef);
  const [cursors, cursorMap] = useMap<{ [userId: string]: UserCursor }>(
    props.channelId,
    "cursors"
  );

  useEffect(() => {
    if (user != null) {
      if (hideMouse) {
        cursorMap?.delete(user.id);
      } else {
        cursorMap?.set(user?.id, {
          user,
          position: mousePosition,
        });
      }
    }
  }, [user?.id, mousePosition, hideMouse]);

  return <MousePad ref={mousePadRef}>{/* render the cursors */}</MousePad>;
}

const MousePad = styled.div`
  width: 100vw;
  height: 100vh;
  background: red;
`;
