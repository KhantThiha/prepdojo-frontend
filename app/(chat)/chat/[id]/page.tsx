import ChatInterface from "@/components/chat/chat-interface";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function ChatPage() {
  return (
    <SidebarProvider>
                <AppSidebar />
        <SidebarInset>
        <ChatInterface/>
        </SidebarInset>
        </SidebarProvider>
  );
}
