export type SlackMessage = {
  id: string;
  role: 'user' | 'assistant' | 'human_reply';
  text: string;
  timestamp: Date;
}