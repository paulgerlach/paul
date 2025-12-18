import { SlackMessage } from '@/types/Chat';

// const CHANNEL = process.env.SLACK_CHANNEL_ID; // Shared support channel with humans

export async function sendSlackMessage(message: string, threadTs: string | null): Promise<string> {
  try {
    // const result = await slack.chat.postMessage({
    //   channel: CHANNEL ?? '',
    //   text: message,
    //   thread_ts: threadTs || undefined, // New parent if no thread_ts
    //   unfurl_links: false,
    // });
    // For new threads, return the parent ts; for replies, return the reply ts (but we use parent for polling)
    return threadTs
      // || result.ts
      || '';
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
}

export async function getSlackThreadMessages(threadTs: string): Promise<SlackMessage[]> {
  if (!threadTs) return [];

  try {
    // const { messages } = await slack.conversations.replies({
    //   channel: CHANNEL ?? '',
    //   ts: threadTs, // Parent ts for the thread
    //   inclusive: true,
    // });

    // return (messages || []).map(msg => ({
    //   id: msg.ts || Date.now().toString(),
    //   role: msg.bot_id ? 'assistant' : 'human_reply',
    //   text: msg.text || '',
    //   timestamp: new Date(Number(msg.ts) * 1000),
    // }));
    return [];
  } catch (error) {
    console.error('Error fetching Slack thread:', error);
    return [];
  }
}