import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from '../hooks/useWebSocket';
import Avatar from '../components/Avatar';
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Messages() {
  const { user } = useAuthStore();
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    fetchConversations,
    fetchConversation,
    fetchMessages,
    sendMessage: sendApiMessage,
    markAllRead
  } = useChatStore();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('conversation');
  
  const [selectedConversation, setSelectedConversation] = useState<number | null>(
    conversationId ? Number(conversationId) : null
  );
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { isConnected, typingUsers, onlineUsers, sendMessage: sendWsMessage, sendTyping, markRead } = useWebSocket(selectedConversation);
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  // Debug: Log conversations state
  useEffect(() => {
    console.log('Conversations updated:', conversations.length, conversations);
  }, [conversations]);
  
  useEffect(() => {
    if (selectedConversation) {
      fetchConversation(selectedConversation);
      fetchMessages(selectedConversation);
      markAllRead(selectedConversation);
      setSearchParams({ conversation: selectedConversation.toString() });
    }
  }, [selectedConversation, fetchConversation, fetchMessages, markAllRead, setSearchParams]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Mark unread messages as read when they appear on screen
  useEffect(() => {
    if (messages.length > 0 && user) {
      messages.forEach(msg => {
        // Mark message as read if it's not from the current user and not already read
        if (msg.sender !== user.id && !msg.is_read) {
          markRead(msg.id);
        }
      });
    }
  }, [messages, user, markRead]);
  
  // Also scroll after sending a message
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleSelectConversation = (convId: number) => {
    setSelectedConversation(convId);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;
    
    const content = messageInput.trim();
    setMessageInput('');
    setIsTyping(false);
    sendTyping(false);
    
    try {
      if (isConnected) {
        // Send via WebSocket for real-time delivery
        sendWsMessage(content);
      } else {
        // Fallback to HTTP - also adds to store immediately
        console.log('WebSocket not connected, using HTTP fallback');
        await sendApiMessage(selectedConversation, content);
        toast.success('Message sent (connection offline)');
      }
      // Scroll to bottom after sending
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };
  
  const handleTyping = (value: string) => {
    setMessageInput(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      sendTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1000);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const chatContent = selectedConversation && currentConversation ? (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        {/* Back button for mobile */}
        <button
          onClick={() => setSelectedConversation(null)}
          className="md:hidden p-2 hover:bg-slate-100 rounded-full"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
        </button>
        <Avatar
          src={currentConversation.other_participant?.profile_picture}
          name={currentConversation.other_participant?.username || 'User'}
          size="sm"
        />
        <div>
          <h2 className="font-bold text-slate-900">
            {currentConversation.other_participant?.username || 'User'}
          </h2>
          {onlineUsers.includes(currentConversation.other_participant?.id || 0) && (
            <p className="text-xs text-green-600">● Online</p>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-0">
        {messages.map((message, idx) => {
          const isOwnMessage = message.sender === user?.id;
          const messageStatus = isOwnMessage
            ? (message.is_read ? 'read' : (message.status || (message.delivered_at ? 'delivered' : 'sent')))
            : undefined;
          const showDate = idx === 0 || formatDate(messages[idx - 1].timestamp) !== formatDate(message.timestamp);
          
          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white text-slate-900 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isOwnMessage && messageStatus && (
                      <span className={messageStatus === 'read' ? 'text-blue-500' : 'text-slate-400'}>
                        {messageStatus === 'sent' ? '✓' : '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>{typingUsers[0]} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex-shrink-0 p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="btn-primary px-6 rounded-full disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <ChatBubbleLeftRightIcon className="h-24 w-24 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-600 mb-2">Select a conversation</h3>
        <p className="text-slate-500">Choose a conversation from the list to start messaging</p>
      </div>
    </div>
  );
  
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-orange-500" />
          Messages
        </h1>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 bg-white border-r border-slate-200 flex-col`}>
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Conversations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading && conversations.length === 0 ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full p-4 flex gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
                    selectedConversation === conv.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                  }`}
                >
                  <Avatar
                    src={conv.other_participant?.profile_picture}
                    name={conv.other_participant?.username || 'User'}
                    size="md"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {conv.other_participant?.username || 'User'}
                      </h3>
                      {conv.last_message && (
                        <span className="text-xs text-slate-500">
                          {formatTime(conv.last_message.timestamp)}
                        </span>
                      )}
                    </div>
                    {conv.last_message && (
                      <p className="text-sm text-slate-600 truncate">
                        {conv.last_message.sender_username === user?.username ? 'You: ' : ''}
                        {conv.last_message.content}
                      </p>
                    )}
                    {conv.unread_count > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white">
                          {conv.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No conversations yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        {chatContent}
      </div>
    </div>
  );
}
