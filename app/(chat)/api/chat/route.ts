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
  const { messages, level, model, userId, chatId } = await req.json()

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  /** Save last user message */
  const last = messages.at(-1)
  if (last?.role === 'user') {
    const { content, metadata } = extractMessageData(last)

    await supabase.from('messages').insert({
      chat_id: chatId,
      user_id: userId,
      role: 'user',
      content,
      metadata
    })
  }

  /** AI provider */
  const provider = createOpenAICompatible({
    name: 'model-name',
    apiKey: 'hello',
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers: { 'X-Level': level }
  })

  /** Stream response + persist on finish */
  const result = streamText({
    model: provider.languageModel(model),
    messages: convertToModelMessages(messages),

    async onFinish({ text, sources, reasoning }) {
      await supabase.from('messages').insert({
        chat_id: chatId,
        user_id: userId,
        role: 'assistant',
        content: text,
        metadata: { sources, reasoning }
      })

      await supabase
        .from('chats')
        .update({
          last_message_at: new Date().toISOString(),
          message_count: messages.length + 1
        })
        .eq('id', chatId)
    }
  })

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true
  })
}