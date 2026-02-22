"use client";

import { Fragment, useEffect, useRef } from "react";
import { UIMessage } from "ai";
// ... other imports
import { QuizCard } from "@/components/ai-elements/quiz-card"; 
import { Conversation, ConversationContent } from "../ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "../ai-elements/message";

type Props = {
  messages: UIMessage[];
  regenerate: () => void;
};

export default function ChatList({ messages, regenerate }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="w-full overflow-y-scroll max-h-[calc(90vh-150px)] px-32 py-18">
      <Conversation>
        <ConversationContent>
          {messages.map((message, messageIndex) => {
            // 1. Ensure parts exist (Fallback)
            const hasParts = message.parts && message.parts.length > 0;
            const parts = hasParts 
              ? message.parts 
              : (message.content ? [{ type: 'text' as const, text: message.content }] : []);
            
            return (
              <Fragment key={message.id}>
                
                {/* 2. Render Text (Standard) */}
                {parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        </Fragment>
                      );
                    
                    // 3. FIX: Render Tool Call (Quiz) */}
                    // The SDK creates a dynamic type for tools: "tool-" + toolName
                    case 'tool-generate_quiz':
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          {/* Pass .input instead of .args */}
                          <QuizCard 
                          input={(part as any).input}                      
                          messageId={message.id}
                          initialQuizResult={(message as any).metadata?.quiz_result}/>
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}

                {/* 4. Actions */}
                {message.role === "assistant" && messageIndex === messages.length - 1 && (
                   <div className="flex gap-2 mt-2 opacity-50 hover:opacity-100 transition-opacity ml-4">
                      <button onClick={regenerate} className="text-xs text-gray-500 hover:text-black">
                         Retry
                      </button>
                   </div>
                )}

              </Fragment>
            );
          })}
        </ConversationContent>
      </Conversation>
      <div ref={bottomRef} />
    </div>
  );
}