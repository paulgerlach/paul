import { slackHttp } from '@/lib/slackHttp';
import { SlackMessage } from '@/types/Chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { threadTs }: { threadTs: string } = await req.json();

    const messages = await getSlackThreadMessages(threadTs);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching Slack messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

const getSlackThreadMessages = async (threadTs:string) : Promise<SlackMessage[]> => {

  if (!threadTs) return [];

  try {
    const res = await slackHttp.post("/conversations.replies", {
      channel: process.env.SLACK_CHANNEL_ID,
      ts: threadTs,
      inclusive: true,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    }
    );

    if (!res.data?.ok) {
      console.error("Slack error:", res.data);
      return [];
    }

    return (res.data.messages || []).map((msg: any) => ({
      id: msg.ts,
      role: msg.bot_id ? "assistant" : "human_reply",
      text: msg.text || "",
      timestamp: new Date(Number(msg.ts) * 1000),
    }));
  } catch (error) {
    console.error("Error fetching Slack thread:", error);
    return [];
  }
}