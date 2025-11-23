import { useEffect } from 'react';
import { supabase } from '../supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface UseRealtimeOptions<T extends Record<string, any>> {
  table: string;
  filter?: string;
  event?: RealtimeEvent | '*';
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old_record: T }) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

/**
 * Hook genérico para suscribirse a cambios en tiempo real de Supabase
 * 
 * @example
 * useRealtime({
 *   table: 'tasks',
 *   filter: 'couple_id=eq.123',
 *   onInsert: (newTask) => setTasks(prev => [...prev, newTask]),
 *   onUpdate: (updatedTask) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t)),
 * });
 */
export function useRealtime<T extends Record<string, any> = any>(options: UseRealtimeOptions<T>) {
  const { table, filter, event = '*', onInsert, onUpdate, onDelete, onChange } = options;

  useEffect(() => {
    let channel: RealtimeChannel;

    const subscribe = () => {
      // Crear canal único
      const channelName = `realtime:${table}${filter ? `:${filter}` : ''}`;
      
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes' as const,
          {
            event: event as any,
            schema: 'public',
            table: table,
            filter: filter,
          },
          (payload: any) => {
            // Callback genérico
            onChange?.(payload);

            // Callbacks específicos por evento
            if (payload.eventType === 'INSERT' && onInsert) {
              onInsert(payload.new as T);
            } else if (payload.eventType === 'UPDATE' && onUpdate) {
              onUpdate(payload.new as T);
            } else if (payload.eventType === 'DELETE' && onDelete) {
              onDelete({ old_record: payload.old as T });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`✅ Subscribed to ${table}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Error subscribing to ${table}`);
          }
        });
    };

    subscribe();

    // Cleanup
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`🔌 Unsubscribed from ${table}`);
      }
    };
  }, [table, filter, event, onInsert, onUpdate, onDelete, onChange]);
}
