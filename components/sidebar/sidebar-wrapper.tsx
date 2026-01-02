'use client'
import { AppSidebar } from "./app-sidebar"
import { useEffect, useState } from "react";
import { getUserChats } from "@/app/actions/get-chats";

export function SidebarWrapper() {
  const [allChats, setAllChats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  
  const PAGE_SIZE = 20;

  // Function to load more chats
  const loadMoreChats = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true)
    
    try {
      const result = await getUserChats({ 
        limit: PAGE_SIZE, 
        offset: totalLoaded 
      })

      if (result.data) {
        setAllChats((prev) => [...prev, ...result.data])
        setTotalLoaded((prev) => prev + (result.data?.length || 0))
        
        // Update total count from first fetch
        if (result.count && totalCount === 0) setTotalCount(result.count)
      }

      // If we got fewer items than requested, or reached the count, we're done
      if (!result.data || result.data.length < PAGE_SIZE || (totalLoaded + result.data.length) >= (result.count || 0)) {
        setHasMore(false)
      }
    } catch (err) {
      console.error("Failed to load chats:", err)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
      loadMoreChats()
  }, [])

  // 2. Pass Data to Client Component
  return <AppSidebar histories={allChats} onLoadMore={loadMoreChats}
  hasMore={hasMore} isLoading={isLoading} />
}