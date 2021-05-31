import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import type { Position } from "hooks/useUserCursor";
import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";
import { getCSSVarColorForString, getHexFromCSSVarColor } from "utils/colors";
import { getSVGCursor } from "utils/cursor";

interface Props {
  position: Position;
  user: TwitchUser | AnonymousTwitchUser;
  onClickAnimationFinish?: () => void;
  isClicking?: boolean;
  showCursor?: boolean;
}

export function Avatar(props: Props) {
  const color = useMemo(
    () => getCSSVarColorForString(props.user.id),
    [props.user]
  );
  const cursor = useMemo(
    () => getSVGCursor(getHexFromCSSVarColor(color)),
    [color]
  );

  // TODO: get random user profile images
  // get a bunch of stuff from Icons8. Maybe like 4-8?
  const image = (props.user as TwitchUser).imageUrl;

  return (
    <Container
      style={{
        x: props.position.x + 16,
        y: props.position.y + 16,
        borderColor: `var(${color})`,
      }}
    >
      {props.showCursor && (
        <Cursor cursor={cursor}>
          {props.isClicking && (
            <Ripple
              style={{ backgroundColor: `var(${color})` }}
              animate={{ scale: [0, 6], opacity: [1, 0] }}
              onAnimationComplete={() => {
                if (props.onClickAnimationFinish != null)
                  props.onClickAnimationFinish();
              }}
            />
          )}
        </Cursor>
      )}
      <ImageContainer>
        {image && <Image width={32} height={32} src={image} />}
      </ImageContainer>
    </Container>
  );
}

const Container = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  border: 4px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  overflow: hidden;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const Cursor = styled.div<{ cursor: string }>`
  position: absolute;
  top: -1.25rem;
  left: -1.5rem;

  &::before {
    width: 2rem;
    height: 2rem;
    content: url("${({ cursor }) => cursor}");
  }
`;

const Ripple = styled(motion.div)`
  position: absolute;
  top: -0.25rem;
  left: 0rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  z-index: -1;
`;

const Image = styled.img``;
