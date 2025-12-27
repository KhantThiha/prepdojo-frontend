"use client";

import { Fragment, useEffect, useRef } from "react";
import { UIMessage } from "ai";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
  MessageAction,
  MessageActions,

} from "@/components/ai-elements/message";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
type Props = {
  messages: UIMessage[];
  regenerate:unknown;
};

export default function MessageList({ messages,regenerate }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full overflow-y-scroll max-h-[calc(90vh-150px)] px-32 py-18">
      <Conversation>
          <ConversationContent>
            {messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      const isLastMessage =
                        messageIndex === messages.length - 1;
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' && isLastMessage && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </Fragment>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
    </div>
  );
}
