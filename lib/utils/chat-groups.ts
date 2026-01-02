// lib/utils/chat-groups.ts

export type ChatGroup = {
  label: string;
  items: any[]; // Replace 'any' with your Chat type
};

export const groupChatsByTime = (chats: any[]): ChatGroup[] => {
  // Define the order of your partitions
  const partitions = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "last7", label: "Previous 7 Days" },
    { id: "last30", label: "Previous 30 Days" },
    { id: "older", label: "Older" },
  ];

  const now = new Date();
  // Normalize dates to start of day for accurate comparison
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const startOfLast7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  const startOfLast30Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);

  // Initialize empty groups
  const grouped: Record<string, any[]> = {
    today: [],
    yesterday: [],
    last7: [],
    last30: [],
    older: [],
  };

  // Sort chats by date (most recent first) before grouping
  const sortedChats = [...chats].sort((a, b) => {
    const dateA = new Date(a.last_message_at || a.created_at).getTime();
    const dateB = new Date(b.last_message_at || b.created_at).getTime();
    return dateB - dateA;
  });

  // Distribute chats into buckets
  sortedChats.forEach((chat) => {
    const chatDate = new Date(chat.last_message_at || chat.created_at);
    // Use a timestamp for comparison to ensure accuracy
    const chatTimestamp = chatDate.getTime();

    let partitionKey = "older";

    if (chatTimestamp >= startOfToday.getTime()) {
      partitionKey = "today";
    } else if (chatTimestamp >= startOfYesterday.getTime()) {
      partitionKey = "yesterday";
    } else if (chatTimestamp >= startOfLast7Days.getTime()) {
      partitionKey = "last7";
    } else if (chatTimestamp >= startOfLast30Days.getTime()) {
      partitionKey = "last30";
    }

    grouped[partitionKey].push(chat);
  });

  // Convert to ordered array for rendering
  const result: ChatGroup[] = partitions
    .map((p) => ({
      label: p.label,
      items: grouped[p.id],
    }))
    .filter((group) => group.items.length > 0); // Remove empty groups

  return result;
};