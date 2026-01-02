"use client"

import {
  ArrowUpRight,
  Link,
  Loader2,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { groupChatsByTime } from "@/lib/utils/chat-groups"
import { cn } from "@/lib/utils" // Ensure you have this utility or import clsx/twMerge

export function NavHistory({
  histories,
  currentChatId,
  onLoadMore,
  hasMore,
  isLoading,
}: {
  histories: any[]
  currentChatId?: string
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}) {
  const { isMobile } = useSidebar()
  
  // 1. Group the chats
  const groups = groupChatsByTime(histories);

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <SidebarGroup key={group.label} className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  {/* href should point to your chat route */}
                  <a href={`/chat/${item.id}`} title={item.title} className={cn(
                    "hover:bg-accent",
                    currentChatId === item.id && "bg-accent"
                  )}>
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <StarOff className="text-muted-foreground" />
                      <span>Remove from history</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link className="text-muted-foreground" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowUpRight className="text-muted-foreground" />
                      <span>Open in New Tab</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
      
      {hasMore && (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onLoadMore}
              className="text-muted-foreground font-normal"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <MoreHorizontal className="mr-2" />
              )}
              <span>{isLoading ? "Loading..." : "Load more chats"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </div>
  )
}