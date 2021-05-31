import { until } from "@open-draft/until";
import { NextApiRequest, NextApiResponse } from "next";

import type { AnonymousTwitchUser, TwitchUser } from "lib/twitch";

const apiKey = process.env.ROOMSERVICE_API_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: maybe restrict this to the twitch domain?
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
    // I am not confident this will always work. Will have to see
    // "https://bidsv8dcz0igrp0y0aice2c99o8xgj.ext-twitch.tv"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { room, user } = req.body as {
    room?: string;
    user?: TwitchUser | AnonymousTwitchUser;
  };

  if (room == null || user == null) {
    return res.status(400).end();
  }

  const resources = [
    {
      object: "room",
      reference: room,
      permission: "join",
    },
  ];

  if (!apiKey) {
    return res.status(500).send("API key not set.");
  }

  const [provisionError, response] = await until(() =>
    fetch("https://super.roomservice.dev/provision", {
      method: "post",
      headers: {
        Authorization: `Bearer: ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user.id,
        resources: resources,
      }),
    })
  );

  if (provisionError != null || !response.ok) {
    return res
      .status(500)
      .send("There was an error provisioning room service.");
  }

  const [parseError, data] = await until(() => response.json());

  if (parseError != null || data == null) {
    return res
      .status(500)
      .send("There was an error provisioning room service.");
  }

  res.json(data);
};
