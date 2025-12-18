

// const slack = new WebClient(process.env.BOT_USER_OAUTH_TOKEN);
// const CHANNEL = process.env.SLACK_CHANNEL_ID;

export async function sendSlackMessage(message: string, threadTs: string | null): Promise<string> {
  return '';
}

export async function getSlackThreadMessages(threadTs: string | null): Promise<{ id: string; role: 'user' | 'assistant'; text: string; timestamp: Date }[]|[]> {
  return [];
}