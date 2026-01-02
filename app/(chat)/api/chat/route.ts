import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

function extractMessageData(message: UIMessage) {
  const text = message.parts
    .filter(p => p.type === 'text')
    .map(p => p.text)
    .join('\n')

  const files = message.parts
  .filter(p => p.type === 'file')
  .map(p => (p as any).data)

  return {
    content: text || null,
    metadata: files.length ? { files } : {}
  }
}

export async function POST(req: Request) {
  try {
    const { messages, level, model, userId, chatId } = await req.json()

    // 1. Validation: Ensure required fields exist
    if (!chatId) {
      console.error("Error: chatId is missing from request body");
      return new Response(JSON.stringify({ error: 'Missing chatId' }), { status: 400 })
    }

    const supabase = await createClient()

    // 2. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // 3. Save User Message
    const last = messages[messages.length - 1]
    if (last?.role === 'user') {
      try {
        const { content, metadata } = extractMessageData(last)

        const { error: insertError } = await supabase.from('messages').insert({
          chat_id: chatId,
          user_id: userId,
          role: 'user',
          content,
          metadata
        })

        if (insertError) {
          console.error("Failed to insert user message:", insertError);
          // We might want to stop here or continue, depending on desired UX. 
          // Usually, logging is enough to keep the chat flowing.
        }
      } catch (err) {
        console.error("Exception extracting/saving user message:", err);
      }
    }

    // 4. Setup AI Provider
    const provider = createOpenAICompatible({
      name: 'model-name',
      apiKey: 'hello',
      baseURL: 'http://127.0.0.1:8000/api/v1',
      headers: { 'X-Level': level }
    })

    // 5. Stream Response
    const result = streamText({
      model: provider.languageModel(model),
      messages: convertToModelMessages(messages),

      // 6. Save Assistant Message on Finish
      async onFinish({ text, sources, reasoning }) {
        console.log(`Saving assistant message for chat ${chatId}`);
        
        try {
          const { error: msgError } = await supabase.from('messages').insert({
            chat_id: chatId,
            role: 'assistant',
            content: text,
            model_used: model,
            metadata: { sources, reasoning }
          })

          if (msgError) {
            console.error("Failed to insert assistant message:", msgError);
          } else {
            // Update chat stats only if message saved successfully
            await supabase
              .from('chats')
              .update({
                last_message_at: new Date().toISOString(),
                message_count: messages.length + 1
              })
              .eq('id', chatId)
          }
        } catch (err) {
          console.error("Exception in onFinish:", err);
        }
      }
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