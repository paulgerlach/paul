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

    return res.data.ts;
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}

export async function getSlackThreadMessages(
  threadTs: string
): Promise<SlackMessage[]> {
  
    console.log('THREAD UNIQUE ID', threadTs);
    
  if (!threadTs) return [];

  try {
    const res = await axios.post("/api/chat/slack/messages", {
      threadTs,
    });

    return res.data.messages;
  } catch (error) {
    console.error("Error fetching Slack thread:", error);
    return [];
  }
}
