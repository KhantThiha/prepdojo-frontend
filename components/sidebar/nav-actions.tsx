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
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Fixed data structure - removed extra array level
const data = [
  [
    {
      label: "Upgrade to Pro",
      icon: Sparkle,
      action: "upgrade"
    },
  ],
  [
    {
      label: "Account",
      icon: BadgeCheck,
      action: "account"
    },
    {
      label: "Billing",
      icon: CreditCard,
      action: "billing"
    },
    {
      label: "Notifications",
      icon: Bell,
      action: "notifications"
    },
  ],
  [
    {
      label: "Personalization",
      icon: PersonStanding,
      action: "personalization"
    },
    {
      label: "Settings",
      icon: Settings,
      action: "settings"
    },
  ],
  [
    {
      label: "Help",
      icon: HelpCircle,
      action: "help"
    },
    {
      label: "Logout",
      icon: LogOut,
      action: "logout"
    },
  ]
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const avatarUrl =
    user?.user_metadata?.avatar_url || // GitHub, some Google
    user?.user_metadata?.picture ||    // Google
    null;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";

  const initial = displayName.charAt(0).toUpperCase();

  // Handle menu item clicks
  const handleMenuItemClick = async (action: string) => {
    setIsOpen(false); // Close popover
    
    switch (action) {
      case "upgrade":
        router.push("/pricing");
        break;
      case "account":
        router.push("/account");
        break;
      case "billing":
        router.push("/billing");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "personalization":
        router.push("/personalization");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "help":
        router.push("/help");
        break;
      case "logout":
        await signOut();
        router.push("/login");
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

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
          <Avatar className="cursor-pointer">
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback>{initial}</AvatarFallback>
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
                      {group.map((item, itemIndex) => (
                        <SidebarMenuItem key={itemIndex}>
                          <SidebarMenuButton 
                            onClick={() => handleMenuItemClick(item.action)}
                            className={item.action === "logout" ? "text-red-600" : ""}
                          >
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