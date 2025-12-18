import { useState, useEffect } from "react"
import { supabase } from '@/utils/supabase/client';
import { sendSlackMessage, getSlackThreadMessages } from '@/actions/slackChat';

interface SlackMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

export const useSlackChat = () => {
  const [messages, setMessages] = useState<SlackMessage[]>([])
  const [status, setStatus] = useState<'ready' | 'sending' | 'connecting'>('connecting')
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [threadTs, setThreadTs] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'ready')
      return;
    const initializeConnection = async () => {
      try {
        console.log("Initialize Slack Connection");
      } catch (error) {
        console.error(
          "Error initializing connection to Slack Connection:",
          error
        );
      }
    };
    initializeConnection();
  }, []);


  useEffect(() => {
    const getUserSlackThread = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        //Adjust this to pesrist thread to database
        const stored = localStorage.getItem(`slack_thread_${user.id}`);
        if (stored) setThreadTs(stored);
      }
    };
    getUserSlackThread();
  }, []);

  useEffect(() => {
    if (!threadTs) return;
    const interval = setInterval(async () => {
      try {
        const newMessages = await getSlackThreadMessages(threadTs);
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const toAdd = newMessages.filter(m => !existingIds.has(m.id));
          return [...prev, ...toAdd];
        });
      } catch (error) {
        console.error('Error fetching Slack messages:', error);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [threadTs]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !userId) return

    const userMessage: SlackMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setStatus('sending')

    try {
      const newThreadTs = await sendSlackMessage(text.trim(), threadTs);
      if (!threadTs) {
        setThreadTs(newThreadTs);
        localStorage.setItem(`slack_thread_${userId}`, newThreadTs);
      }
      // Fetch any new messages immediately
      const newMessages = await getSlackThreadMessages(newThreadTs);
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const toAdd = newMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...toAdd];
      });
    } catch (error) {
      console.error('Error sending Slack message:', error);
    } finally {
      setStatus('ready')
    }
  }

  return {
    messages,
    sendMessage,
    status,
    input,
    setInput
  }
}