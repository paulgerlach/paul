import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { slackHttp } from '@/lib/slackHttp';

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, threadTs }: { message: string; threadTs: string | null } = await req.json();

    const formattedMessage = threadTs
      ? message.trim()
      : `Support request from user ${user.id}: ${message.trim()}`;

    const ts = await sendSlackMessage(formattedMessage, threadTs);

    return NextResponse.json({ ts });
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

const sendSlackMessage = async (formattedMessage: string, threadTs: string | null): Promise<string> => {
  try {
    const res = await slackHttp.post("/chat.postMessage", {
      channel: process.env.SLACK_CHANNEL_ID,
      text: formattedMessage,
      thread_ts: threadTs || undefined,
      unfurl_links: false,
    });

    if (!res.data?.ok) {
      console.error("Slack error:", res.data);
      throw new Error("Slack chat.postMessage failed");
    }

    // Return parent thread ts
    return threadTs || res.data.ts;
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}


