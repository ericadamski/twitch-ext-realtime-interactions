import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useMap } from "@roomservice/react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";

import { useTwitchUser } from "hooks/useTwitchUser";
import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";
import { Position, useUserCursor } from "hooks/useUserCursor";
import { Avatar } from "./Avatar";
import { getHexFromCSSVarColor, getCSSVarColorForString } from "utils/colors";
import { getSVGCursor } from "utils/cursor";

interface Props {
  channelId: string;
}

interface UserCursor {
  user: TwitchUser | AnonymousTwitchUser;
  position: Position;
  isClicking?: boolean;
}

export function Cursors(props: Props) {
  const user = useTwitchUser();
  const [clicking, setClicking] = useState<boolean>(false);
  const [mousePosition, hideMouse] = useUserCursor();
  const [cursors, cursorMap] = useMap<{ [userId: string]: UserCursor }>(
    props.channelId,
    "cursors"
  );
  const userCursor = useMemo(
    () =>
      user?.id
        ? getSVGCursor(getHexFromCSSVarColor(getCSSVarColorForString(user.id)))
        : "",
    [user]
  );

  const handleClick = useCallback(() => {
    setClicking(true);
    if (cursorMap && user != null) {
      cursorMap.set(user.id, {
        ...cursorMap.get(user.id)!,
        isClicking: true,
      });
    }
  }, [cursorMap, user]);

  const onClickAnimationFinish = useCallback(() => {
    setClicking(false);
    if (cursorMap && user != null) {
      cursorMap.set(user.id, {
        ...cursorMap.get(user.id)!,
        isClicking: false,
      });
    }
  }, [cursorMap, user]);

  useEffect(() => {
    if (user != null) {
      if (hideMouse) {
        cursorMap?.delete(user.id);
      } else {
        cursorMap?.set(user.id, {
          user,
          position: mousePosition,
        });
      }

      return () => {
        cursorMap?.delete(user.id);
      };
    }
  }, [user?.id, mousePosition, hideMouse]);

  return (
    <MousePad cursor={userCursor} onClick={handleClick}>
      {user && (
        <AnimatePresence>
          {/* My cursor avatar */}
          {!hideMouse && (
            <Avatar
              user={user}
              isClicking={clicking}
              position={mousePosition}
              onClickAnimationFinish={onClickAnimationFinish}
            />
          )}
          {/* render the cursors */}
          {cursorMap?.keys.map((userId) => {
            // Don't render my own.
            if (userId === user.id) return null;

            return (
              <Avatar
                key={userId}
                showCursor
                isClicking={cursors[userId]?.isClicking}
                user={cursors[userId].user}
                position={cursors[userId].position}
              />
            );
          })}
        </AnimatePresence>
      )}
    </MousePad>
  );
}

const MousePad = styled.div<{ cursor: string }>`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  cursor: url("${(props) => props.cursor}") 6 2, default;
`;
