'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare, Trash2, Archive, Pin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatItem } from './chat-item';
import Link from 'next/link';

interface ChatHistoryProps {
  onChatSelect?: (chatId: string) => void;
  className?: string;
}

export function ChatHistory({ onChatSelect, className = '' }: ChatHistoryProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  // Load chats when user is available or from localStorage
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    const loadChats = async () => {
      try {
        if (user) {
          // Load from Supabase if authenticated
          const { data } = await supabase
            .from('chats')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_archived', false)
            .order('last_message_at', { ascending: false })
            .limit(50);
          
          setChats(data || []);
          
          // Also save to localStorage for offline access
          localStorage.setItem('chatHistory', JSON.stringify(data || []));
        } else {
          // Load from localStorage if not authenticated
          const savedChats = localStorage.getItem('chatHistory');
          if (savedChats) {
            setChats(JSON.parse(savedChats));
          }
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user, authLoading]);

  const createNewChat = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      const { data } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: 'New Chat',
          model_used: 'gpt-3.5-turbo'
        })
        .select()
        .single();
      
      if (data) {
        setChats(prev => [data, ...prev]);
        
        // Navigate to new chat
        if (onChatSelect) {
          onChatSelect(data.id);
        } else {
          window.location.href = `/chat/${data.id}`;
        }
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) return;
    
    try {
      // Delete from Supabase if authenticated
      await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);
      
      // Update local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // Remove from localStorage if not authenticated
      if (!user) {
        const savedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        localStorage.setItem('chatHistory', JSON.stringify(
          savedChats.filter((chat: any) => chat.id !== chatId)
        ));
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const archiveChat = async (chatId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('chats')
        .update({ is_archived: true })
        .eq('id', chatId);
      
      // Update local state
      setChats(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, is_archived: true }
            : chat
        )
      );
    } catch (error) {
      console.error('Error archiving chat:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Chat History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Actions */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <Button onClick={createNewChat}>
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </CardContent>
      
      {/* Chat List */}
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No chats found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                onSelect={() => {
                  if (onChatSelect) {
                    onChatSelect(chat.id);
                  } else {
                    window.location.href = `/chat/${chat.id}`;
                  }
                }}
                onDelete={deleteChat}
                onArchive={archiveChat}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}