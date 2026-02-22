import { streamText, convertToModelMessages, tool } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { z } from 'zod' // Ensure you have zod installed

export const maxDuration = 30

// 1. Define the tool schema for the Frontend/SDK
const generateQuizTool = tool({
  description: 'Generates a multiple-choice question for the user.',
  parameters: z.object({
    question: z.string(),
    options: z.array(z.string()),
    correct_index: z.number(),
    explanation: z.string(),
  }),
  // IMPORTANT: Do NOT provide an 'execute' function.
  // This ensures streamText passes the tool data to the frontend 
  // instead of trying to execute it server-side.
})

export async function POST(req: Request) {
  try {
    const { messages, level, model, userId, chatId,topic } = await req.json()

    if (!chatId) {
      console.error("Error: chatId is missing from request body");
      return new Response(JSON.stringify({ error: 'Missing chatId' }), { status: 400 })
    }

    // 4. Setup AI Provider
    const provider = createOpenAICompatible({
      name: 'model-name',
      apiKey: 'hello', // Not used for local, but required by SDK
      baseURL: 'http://127.0.0.1:8000/api/v1', // Ensure this points to your Python
      headers: { 
        'X-Level': level,
        'X-Chat-Id': chatId,
        'X-User-Id': userId,
        'X-Topic': topic,
       }
    })

    // 5. Stream Response
    const result = streamText({
      model: provider.languageModel(model),
      messages: convertToModelMessages(messages),
      
      // 2. Pass the tools here so streamText recognizes them
      tools: {
        generate_quiz: generateQuizTool
      },
    })

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true
    })

  } catch (error) {
    console.error("Unexpected error in POST /api/chat:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}