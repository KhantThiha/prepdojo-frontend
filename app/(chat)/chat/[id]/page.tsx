import ChatInterface from "@/components/chat/chat-interface";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";

// 1. Update the interface to define params as a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

// 2. Make the component async
export default async function ChatPage({ params }: PageProps) {
  // 3. Await params before destructuring
  const { id: chatId } = await params;

  console.log("chatId:", chatId) // This should now log the actual ID

  return (
    <SidebarProvider>
          <SidebarWrapper/>
        <SidebarInset>
        <ChatInterface chatId={chatId}/>
        </SidebarInset>
        </SidebarProvider>
  );
}