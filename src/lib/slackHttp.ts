// src/lib/slackHttp.ts
import axios from "axios";

export const slackHttp = axios.create({
  baseURL: "https://slack.com/api",
  headers: {
    Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});
