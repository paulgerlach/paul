import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { sendSlackMessage, getSlackThreadMessages } from "@/actions/slackChat";

interface SlackMessage {
  id: string;
  role: "user" | "assistant" | "human_reply";
  text: string;
  timestamp: Date;
}

export const useSlackChat = () => {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [status, setStatus] = useState<
    "ready" | "sending" | "waiting_for_human" | "connecting"
  >("connecting");
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [threadTs, setThreadTs] = useState<string | null>(null);
  const [lastSentTs, setLastSentTs] = useState<string | null>(null);

  useEffect(() => {
    const getUserSlackThread = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const stored = localStorage.getItem(`slack_thread_${user.email}`);
        if (stored) setThreadTs(stored);
      }
    };
    getUserSlackThread();
  }, []);

  useEffect(() => {
    if (!threadTs) return;
    let pollInterval = 5000;
    if (status === "waiting_for_human") pollInterval = 2000;

    const interval = setInterval(async () => {
      try {
        const newMessages = await getSlackThreadMessages(threadTs);
        console.log(newMessages);
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const toAdd = newMessages.filter((m) => !existingIds.has(m.id));
          return [...prev, ...toAdd];
        });

        if (status === "waiting_for_human") {
          const hasHumanReply = newMessages.some(
            (m) =>
              m.role === "human_reply" &&
              new Date(m.timestamp).getTime() >
                (lastSentTs ? Number(lastSentTs) * 1000 : 0)
          );
          if (hasHumanReply) {
            setStatus("ready");
          }
        }
      } catch (error) {
        console.error("Error fetching Slack messages:", error);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [threadTs, status, lastSentTs]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !userId) return;


    const userMessage: SlackMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatus("sending");

    try {
      const newThreadTs = await sendSlackMessage(text, threadTs);
      setLastSentTs(newThreadTs);
      if (!threadTs) {
        setThreadTs(newThreadTs);
        localStorage.setItem(`slack_thread_${userId}`, newThreadTs);
      }

      const initialMessages = await getSlackThreadMessages(
        newThreadTs || threadTs!
      );
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const toAdd = initialMessages.filter((m) => !existingIds.has(m.id));
        return [...prev, ...toAdd];
      });

      setStatus("waiting_for_human");

      setTimeout(() => {
        if (status === "waiting_for_human") {
          setStatus("ready");
          console.log("Timeout: No human reply detected.");
        }
      }, 300000);
    } catch (error) {
      console.error("Error sending Slack message:", error);
      setStatus("ready");
    }
  };

  return {
    messages,
    sendMessage,
    status,
    input,
    setInput,
  };
};
