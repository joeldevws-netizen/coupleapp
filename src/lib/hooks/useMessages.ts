import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useRealtime } from './useRealtime';
import type { Database } from '../types/database.types';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

/**
 * Hook para gestionar mensajes con sincronización en tiempo real
 * 
 * @param coupleId - ID de la pareja
 * @param limit - Límite de mensajes a cargar (default: 50)
 * @returns { messages, loading, sendMessage, loadMore, hasMore }
 */
export function useMessages(coupleId: string | null, limit: number = 50) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  // Cargar mensajes iniciales
  useEffect(() => {
    if (!coupleId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      const { data, error, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
        setHasMore((count || 0) > limit);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [coupleId, limit]);

  // Suscribirse a nuevos mensajes en tiempo real
  useRealtime<Message>({
    table: 'messages',
    filter: coupleId ? `couple_id=eq.${coupleId}` : undefined,
    event: 'INSERT',
    onInsert: (newMessage) => {
      setMessages((prev) => [newMessage, ...prev]);
    },
  });

  // Enviar mensaje
  const sendMessage = async (content: string, senderName: string) => {
    if (!coupleId) return { error: new Error('No couple ID') };
    if (content.trim().length === 0) return { error: new Error('Empty message') };
    if (content.length > 500) return { error: new Error('Message too long') };

    const { data: user } = await supabase.auth.getUser();
    
    const newMessage: MessageInsert = {
      couple_id: coupleId,
      content: content.trim(),
      sender_name: senderName,
    };

    const { data, error } = await (supabase as any)
      .from('messages')
      .insert([newMessage])
      .select()
      .single();

    return { data, error };
  };

  // Cargar más mensajes (paginación)
  const loadMore = async () => {
    if (!coupleId || !hasMore) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
      .range(messages.length, messages.length + limit - 1);

    if (!error && data) {
      setMessages((prev) => [...prev, ...data]);
      setHasMore(data.length === limit);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    loadMore,
    hasMore,
  };
}
