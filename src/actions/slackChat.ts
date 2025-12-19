import axios from "axios";
import { SlackMessage } from "@/types/Chat";

export async function sendSlackMessage(
  message: string,
  threadTs: string | null
): Promise<string> {
  try {
    const res = await axios.post("/api/chat/slack/send", {
      message,
      threadTs,
    });

    // API should return { threadTs: string }
    return res.data.threadTs;
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}

export async function getSlackThreadMessages(
  threadTs: string
): Promise<SlackMessage[]> {
  if (!threadTs) return [];

  try {
    const res = await axios.post("/api/chat/slack/messages", {
      threadTs,
    });

    // API should return { messages: SlackMessage[] }
    return res.data.messages ?? [];
  } catch (error) {
    console.error("Error fetching Slack thread:", error);
    return [];
  }
}
