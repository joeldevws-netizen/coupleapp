import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useCoupleAuth } from './useCoupleAuth';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  created_at: string;
}

export function useMessagesSync() {
  const { coupleId, isAuthenticated } = useCoupleAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !coupleId) {
      setLoading(false);
      return;
    }

    fetchMessages();
    subscribeToChanges();
  }, [coupleId, isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('messages')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('messages_changes')
      .on('postgres_changes' as any, {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `couple_id=eq.${coupleId}`,
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string, senderName: string) => {
    try {
      const { error } = await (supabase as any)
        .from('messages')
        .insert([{ content, sender_name: senderName, couple_id: coupleId }]);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
