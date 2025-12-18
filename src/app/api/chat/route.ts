import { salesPersona, supportPersona } from '@/lib/constants/ai/personas';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { supabaseServer } from '@/utils/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  // Check for authenticated session
  const {
    data: { session },
  } = await supabase.auth.getSession();


  const { messages }: { messages: UIMessage[] } = await req.json();
  

  const result = streamText({
    model: "xai/grok-4.1-fast-reasoning",
    system: !session ?  salesPersona : supportPersona,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}