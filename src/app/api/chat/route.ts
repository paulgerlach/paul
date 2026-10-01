import { salesPersona } from '@/lib/constants/ai/personas';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: "xai/grok-4.1-fast-reasoning",
    system: salesPersona,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}