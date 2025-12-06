import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const provider = createOpenAICompatible({
  name: 'model-name',
  apiKey: "hello",
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    'X-Level': '', // Will be set dynamically
  },
});

export async function POST(req: Request) {

  const { messages, level,model }: { messages: UIMessage[]; level: string;model:string } = await req.json();
  const dynamicProvider = createOpenAICompatible({
    name: 'model-name',
    apiKey: "hello",
    baseURL: "http://127.0.0.1:8000/api/v1",
    headers: {
      'X-Level': level, // Pass level in header
    },
  });
  const result = streamText({
    model: dynamicProvider.languageModel(model),
    messages: convertToModelMessages(messages),
  });
  // Return UIMessage stream (supports sources + reasoning)
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });

}