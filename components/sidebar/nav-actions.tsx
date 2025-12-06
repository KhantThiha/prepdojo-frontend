"use client"

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  PersonStanding,
  Settings,
  Sparkle,
  Star,

} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const data = [
  [
    {
      label: "upgrade to Pro",
      icon: Sparkle,
    },
    
  ],[
    {
      label: "Account",
      icon: BadgeCheck,
    },
    {
      label: "Billing",
      icon: CreditCard,
    },
    {
      label: "Notifications",
      icon: Bell,
    },
  ],[
    {
      label: "Personalization",
      icon: PersonStanding,
    },
    {
      label: "Setting",
      icon: Settings,
    },
  ],[
    {
      label: "Help",
      icon: HelpCircle,
    },
    {
      label: "Logout",
      icon: LogOut,
    },
  ]
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(false)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-muted-foreground hidden font-medium md:inline-block">
        Edit Oct 08
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
