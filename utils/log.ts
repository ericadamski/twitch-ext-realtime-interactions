import { IS_PROD } from "./env";

export function log(...args: unknown[]) {
  let logger = console.log;

  if (typeof window !== "undefined" && !IS_PROD) {
    logger = window.Twitch.ext.rig.log;
  }

  logger(JSON.stringify(args));
}
