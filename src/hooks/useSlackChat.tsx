import { useState, useEffect } from "react";
import { sendSlackMessage, getSlackThreadMessages } from "@/actions/slackChat";
import { SlackMessage } from "@/types/Chat";

const isWithinBusinessHours = (): boolean => {
  const now = new Date();

  const berlinTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  );
  const berlinHour = berlinTime.getHours();
  const dayOfWeek = berlinTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Monday to Friday: 1-5
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Business hours: 8:00 - 20:00 (8 AM to 8 PM)
  return isWeekday && berlinHour >= 8 && berlinHour < 20;
};

export const useSlackChat = (userId?: string | undefined) => {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [status, setStatus] = useState<
    "ready" | "sending" | "waiting_for_human" | "fetching_messages"
  >("ready");
  const [input, setInput] = useState("");
  const [threadTs, setThreadTs] = useState<string | null>(null);
  const [lastSentTs, setLastSentTs] = useState<string | null>(null);
  const [isOutOfOffice, setIsOutOfOffice] = useState(false);
  const [outOfOfficeMessageAdded, setOutOfOfficeMessageAdded] = useState<
    Set<string>
  >(new Set());

  // Check if we're out of office on initial load and when time changes
  useEffect(() => {
    const checkOfficeHours = () => {
      const isOutOfHours = !isWithinBusinessHours();
      setIsOutOfOffice(isOutOfHours);
    };

    // Initial check
    checkOfficeHours();

    // Set up interval to check every minute
    const interval = setInterval(checkOfficeHours, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getUserSlackThread = async () => {
        const stored = localStorage.getItem(
          `slack_thread_${userId ?? `visitor`}`
        );
        if (stored)
          setThreadTs(stored);
    };
    getUserSlackThread();
  }, [userId]);

  useEffect(() => {
    console.log('THREADS : ', threadTs)
    if (!threadTs) return;
    const loadInitialMessages = async () => {
      setStatus("fetching_messages");
      try {
        const initialMessages = await getSlackThreadMessages(threadTs);
        setMessages(initialMessages);
        setStatus("ready");
      } catch (error) {
        console.error("Error loading initial messages:", error);
        setStatus("ready");
      }
    };
    loadInitialMessages();
  }, [threadTs]);

  useEffect(() => {
    if (!threadTs) return;

    let pollInterval = 5000;
    if (status === "waiting_for_human") pollInterval = 2000;

    const interval = setInterval(async () => {
      setStatus("fetching_messages");
      try {
        const newMessages = await getSlackThreadMessages(threadTs);

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const toAdd = newMessages.filter((m) => !existingIds.has(m.id));

          // Check if we need to add out-of-office message for new assistant messages
          const enhancedMessages = [...toAdd];
          if (isOutOfOffice) {
            const hasAssistantMessage = toAdd.some(
              (m) => m.role === "assistant"
            );
            if (hasAssistantMessage) {
              const outOfOfficeMessage: SlackMessage = {
                id: `${Date.now()}`,
                role: "human_reply",
                text: "Vielen Dank für Ihre Nachricht. Unser Team ist derzeit außerhalb der Geschäftszeiten. Ihr Anliegen wurde erfasst und wird am nächsten Werktag priorisiert bearbeitet.",
                timestamp: new Date(),
              };
              enhancedMessages.push(outOfOfficeMessage);
              setOutOfOfficeMessageAdded((prev) => new Set(prev).add(threadTs));
            }
          }

          return [...prev, ...enhancedMessages];
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
        } else {
          setStatus("ready");
        }
      } catch (error) {
        console.error("Error fetching Slack messages:", error);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [threadTs, status, lastSentTs, isOutOfOffice, outOfOfficeMessageAdded]);

  const sendMessage = async (text: string) => {
    console.log("MESSAGE", text);
    console.log("Thread", threadTs)
    if (!text.trim()) return;

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
        localStorage.setItem(`slack_thread_${userId ?? `visitor`}`, newThreadTs);
      }

      // Don't automatically add out-of-office message here
      // Let the polling effect handle it based on new messages from Slack
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
    isOutOfOffice,
  };
};
