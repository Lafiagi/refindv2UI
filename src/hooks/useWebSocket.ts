import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';

export function useWebSocket(conversationId: number | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { user } = useAuthStore();
  const { addMessage, updateMessage, fetchUnreadCount } = useChatStore();
  
  useEffect(() => {
    if (!conversationId || !user) return;
    
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    // Get WebSocket URL - point to backend
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Remove protocol and /api suffix from VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const backendHost = apiUrl.replace(/^https?:\/\//, '').replace(/\/api$/, '');
    const wsUrl = `${wsProtocol}//${backendHost}/ws/chat/${conversationId}/?token=${token}`;
    
    console.log('Connecting to WebSocket:', wsUrl.replace(token, 'TOKEN_HIDDEN'));
    
    // Create WebSocket connection
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      
      switch (data.type) {
        case 'connection_established':
          console.log('✅', data.message);
          break;
          
        case 'message_sent':
          console.log('📤 Message sent successfully:', data.message);
          // Add own message to the store immediately
          addMessage(data.message);
          fetchUnreadCount();
          break;
          
        case 'chat_message':
          console.log('💬 New message from other user:', data.message);
          // Only add if it's from another user
          addMessage(data.message);
          fetchUnreadCount();
          break;
          
        case 'typing':
          console.log('⌨️  Typing:', data.user, data.is_typing);
          if (data.is_typing) {
            setTypingUsers(prev => [...new Set([...prev, data.user])]);
          } else {
            setTypingUsers(prev => prev.filter(u => u !== data.user));
          }
          
          // Clear typing after 3 seconds
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u !== data.user));
          }, 3000);
          break;
          
        case 'message_read':
          console.log('✓✓ Message read:', data.message);
          if (data.message) {
            updateMessage(data.message);
          }
          break;
          
        case 'user_online':
          console.log('🟢 User online:', data.username);
          setOnlineUsers(prev => [...new Set([...prev, data.user_id])]);
          break;
          
        case 'user_offline':
          console.log('⚫ User offline:', data.username);
          setOnlineUsers(prev => prev.filter(id => id !== data.user_id));
          break;
          
        case 'online_users':
          console.log('👥 Online users:', data.user_ids);
          setOnlineUsers(data.user_ids || []);
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };
    
    ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      
      // Clear any pending reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Auto-reconnect after 1 second if closed unexpectedly
      if (event.code !== 1000) { // 1000 = normal closure
        console.log('🔄 Will reconnect when component remounts...');
        // The effect will re-run when the component is navigated back to
      }
    };
    
    return () => {
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Only close if still connected
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000); // Normal closure code
      }
      
      // Note: Keep online users in state - they'll refresh when we reconnect
    };
  }, [conversationId, user, addMessage, updateMessage, fetchUnreadCount]);
  
  const sendMessage = (content: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        message: content
      }));
    }
  };
  
  const sendTyping = (isTyping: boolean) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping
      }));
    }
  };
  
  const markRead = (messageId: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mark_read',
        message_id: messageId
      }));
    }
  };
  
  return {
    isConnected,
    typingUsers,
    onlineUsers,
    sendMessage,
    sendTyping,
    markRead
  };
}
