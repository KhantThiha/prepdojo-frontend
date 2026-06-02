"use client"
import { NavActions } from "@/components/sidebar/nav-actions"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { MicIcon, GlobeIcon, CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatList from "@/components/chat/message-list";
import { useChat } from '@ai-sdk/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { getChatHistory } from "@/app/actions/get-chat-history";
import { TopicSelector } from "../ai-elements/topic-selector";

const models = [

  {
    id: "openai/gpt-oss-120b",
    name: "gpt-oss-120b",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "openai/gpt-oss-20b",
    name: "gpt-oss-20b",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "openai/gpt-oss-safeguard-20b",
    name: "gpt-oss-safeguard-20b",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "qwen/qwen3-32b",
    name: "qwen3-32b",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "llama-3.3-70b-versatile",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  }, {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "llama-4-maverick-17b-128e-instruct",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  }, {
    id: "meta-llama/llama-guard-4-12b",
    name: "llama-guard-4-12b",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  }, {
    id: "allam-2-7b",
    name: "allam-2-7b",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "gpt-4o",
    name: "gpt-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
];
interface ChatInterfaceProps {
  chatId: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [activeChatId, setActiveChatId] = useState<string>(chatId)
  const [creatingChat, setCreatingChat] = useState(false)
  const { user, session } = useAuth();
  const supabase = createClient();
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);
  const selectedModelData = models.find((m) => m.id === model);
  const [level, setLevel] = useState<string>("N5");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isChatStarted, setIsChatStarted] = useState(false);

  // Use setMessages to load history
  const { messages, sendMessage, status, regenerate, setMessages } = useChat();
  const [selectedTopics, setSelectedTopics] = useState<string | null>(null);
  // NEW: Effect to load history when chatId changes
  useEffect(() => {
    const loadHistory = async () => {
      if (chatId) {
        // If a chatId exists in the URL, we are entering an existing chat
        setActiveChatId(chatId);
        setIsChatStarted(true); // Show chat UI immediately

        // Fetch history
        try {
          const history = await getChatHistory(chatId);
          console.log(history)
          if (history.length > 0) {
            // Load messages into useChat state
            setMessages(history);
          }
        } catch (error) {
          console.error("Failed to load chat history", error);
        }
      } else {
        // New Chat: Clear state
        setMessages([]);
        setActiveChatId('');
        setIsChatStarted(false);
      }
    };

    loadHistory();
  }, [chatId]); // Re-run when chatId changes

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)
    if (!(hasText || hasAttachments)) return

    const chatIdToUse = await createChatIfNeeded()
    if (!chatIdToUse) return;

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          chatId: chatIdToUse,
          model,
          level,
          userId: user?.id,
          topic: selectedTopics,
          accessToken: session?.access_token,
        },
      }
    )
    setText('')
  }

  function getSimpleTitle(text: string): string {
    if (!text) return "New Chat";

    const trimmed = text.trim();

    if (trimmed.length <= 40) return trimmed;

    const words = trimmed.split(/\s+/);
    const title = words.slice(0, 6).join(" ");

    return title + "...";
  }
  async function createChatIfNeeded(): Promise<string> {
    if (activeChatId) return activeChatId
    if (!user || creatingChat) return ''

    setCreatingChat(true)

    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        message_count: 0,
        model_used: model,
        title: getSimpleTitle(text)
      })
      .select('id')
      .single()

    setCreatingChat(false)

    if (error || !data) {
      throw new Error('Failed to create chat')
    }

    setActiveChatId(data.id)
    setIsChatStarted(true)

    return data.id
  }


  return (
    <>
      <header className="absolute w-full z-10 bg-white border-b">
        <div className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Select
              value={level}
              onValueChange={(value) => {
                setLevel(value);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Level</SelectLabel>
                  <SelectItem value="N5">N5</SelectItem>
                  <SelectItem value="N4">N4</SelectItem>
                  <SelectItem value="N3">N3</SelectItem>
                  <SelectItem value="N2">N2</SelectItem>
                  <SelectItem value="N1">N1</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </div>
      </header>
      <div className="flex flex-col items-end max-h-screen h-full justify-center gap-4 relative">
        {!isChatStarted ? (
          <div className="w-full flex justify-center px-32">
            <div className="w-fit text-[40px] @max-md:text-[24px] font-semibold line-clamp-1">
              <span>Hi,</span>
              <span>User</span>
            </div>
          </div>
        ) : (
          <div className="w-full grow">
            <ChatList messages={messages} regenerate={regenerate}></ChatList>
          </div>
        )}
        <div className="w-full flex-none px-32 mb-8 gap-4 grid">
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputHeader>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea
                ref={textareaRef}
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton
                  onClick={() => setUseMicrophone(!useMicrophone)}
                  variant={useMicrophone ? "default" : "ghost"}
                >
                  <MicIcon size={16} />
                  <span className="sr-only">Microphone</span>
                </PromptInputButton>
                <PromptInputButton
                  onClick={() => setUseWebSearch(!useWebSearch)}
                  variant={useWebSearch ? "default" : "ghost"}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <ModelSelector
                  onOpenChange={setModelSelectorOpen}
                  open={modelSelectorOpen}
                >
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton>
                      {selectedModelData?.chefSlug && (
                        <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                      )}
                      {selectedModelData?.name && (
                        <ModelSelectorName>
                          {selectedModelData.name}
                        </ModelSelectorName>
                      )}
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="Search models..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                      {["OpenAI", "Anthropic", "Google"].map((chef) => (
                        <ModelSelectorGroup key={chef} heading={chef}>
                          {models
                            .filter((m) => m.chef === chef)
                            .map((m) => (
                              <ModelSelectorItem
                                key={m.id}
                                onSelect={() => {
                                  setModel(m.id);
                                  setModelSelectorOpen(false);
                                }}
                                value={m.id}
                              >
                                <ModelSelectorLogo provider={m.chefSlug} />
                                <ModelSelectorName>{m.name}</ModelSelectorName>
                                <ModelSelectorLogoGroup>
                                  {m.providers.map((provider) => (
                                    <ModelSelectorLogo
                                      key={provider}
                                      provider={provider}
                                    />
                                  ))}
                                </ModelSelectorLogoGroup>
                                {model === m.id ? (
                                  <CheckIcon className="ml-auto size-4" />
                                ) : (
                                  <div className="ml-auto size-4" />
                                )}
                              </ModelSelectorItem>
                            ))}
                        </ModelSelectorGroup>
                      ))}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
                <TopicSelector
                  selectedTopics={selectedTopics}
                  onChange={setSelectedTopics}
                />
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!(text.trim() || status) || status === "streaming"}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>

        </div>
      </div>
    </>
  )
}