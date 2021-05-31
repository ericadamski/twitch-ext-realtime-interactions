import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

import { getUser } from "lib/twitch";
import { getActiveTwitchToken } from "utils/getActiveTwitchToken";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: maybe restrict this to the twitch domain?
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const apiToken = await getActiveTwitchToken();

  if (apiToken == null) {
    return res.status(500).end();
  }

  const { token, oId } = req.body as { token?: string; oId?: string };

  if (token == null || oId == null) {
    return res.status(400).end();
  }

  const decoded = jwt.decode(token);

  if (decoded == null) {
    return res.status(401).end();
  }

  const { user_id: userId, opaque_user_id: oUserId } = decoded as {
    user_id?: string;
    opaque_user_id: string;
  };

  res.json(userId == null ? { id: oUserId } : await getUser(apiToken, userId));
};
