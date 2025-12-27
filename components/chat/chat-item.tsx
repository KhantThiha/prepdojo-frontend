// components/chat/chat-item.tsx
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Archive, Pin, PinOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface ChatItemProps {
  chat: any;
  onSelect?: (chatId: string) => void;
  onDelete?: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
}

export function ChatItem({ 
  chat, 
  onSelect, 
  onDelete, 
  onArchive 
}: ChatItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lastMessageTime = chat.last_message_at 
    ? formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })
    : '';

  return (
    <div
      className={`p-3 hover:bg-gray-50 cursor-pointer group border-b ${chat.is_archived ? 'bg-gray-50' : 'bg-white'
      }`}
      onClick={() => onSelect && onSelect(chat.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {chat.title.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <h4 className="font-medium truncate">{chat.title}</h4>
            <p className="text-xs text-gray-500">{lastMessageTime}</p>
          </div>
        </div>
        
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end">
            {onDelete && (
              <DropdownMenuItem onClick={() => {
                onDelete(chat.id);
                setIsMenuOpen(false);
              }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
            
            {onArchive && (
              <DropdownMenuItem onClick={() => {
                onArchive(chat.id);
                setIsMenuOpen(false);
              }}>
                <Archive className="h-4 w-4 mr-2" />
                {chat.is_archived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => {
              setIsMenuOpen(false);
              }}>
                {chat.is_pinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}