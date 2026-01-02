import ChatInterface from "@/components/chat/chat-interface";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";

export default function Home() {
  return (
    <SidebarProvider>
                {/* <AppSidebar /> */}
                <SidebarWrapper/>
        <SidebarInset>
        <ChatInterface/>
        </SidebarInset>
        </SidebarProvider>
  );
}
