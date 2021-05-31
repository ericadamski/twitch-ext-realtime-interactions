import React, { useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import type { Position } from "hooks/useUserCursor";
import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";
import { getCSSVarColorForString, getHexFromCSSVarColor } from "utils/colors";
import { getSVGCursor } from "utils/cursor";
import { EBS_URI, IS_PROD } from "utils/env";
import { hashString } from "utils/hashString";

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

  const image = useMemo(
    () =>
      (props.user as TwitchUser).imageUrl ?? getRandomImageUrl(props.user.id),
    [props.user]
  );

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
      <ImageContainer>{image && <Image src={image} />}</ImageContainer>
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

const Image = styled.img`
  max-width: 100%;
`;

function getRandomImageUrl(id: string) {
  return `${IS_PROD ? EBS_URI : ""}/images/profile-${hashString(id) % 14}.png`;
}
