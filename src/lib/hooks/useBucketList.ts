import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useCoupleAuth } from './useCoupleAuth';

interface BucketItem {
  id: string;
  title: string;
  category: 'travel' | 'activity' | 'food' | 'adventure' | 'other';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

const STORAGE_KEY = 'couple-app-bucket-backup';

export function useBucketList() {
  const { coupleId, isAuthenticated } = useCoupleAuth();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !coupleId) {
      setLoading(false);
      return;
    }

    fetchItems();
    subscribeToChanges();
  }, [coupleId, isAuthenticated]);

  const fetchItems = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('bucket_list')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems = (data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        completed: d.completed,
        priority: d.priority,
        notes: d.notes,
      }));

      setItems(formattedItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedItems));
    } catch (error) {
      console.error('Error fetching bucket list:', error);
      const backup = localStorage.getItem(STORAGE_KEY);
      if (backup) setItems(JSON.parse(backup));
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('bucket_list_changes')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'bucket_list',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addItem = async (item: Omit<BucketItem, 'id' | 'completed'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('bucket_list')
        .insert([{ ...item, couple_id: coupleId, completed: false }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding item:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleItem = async (id: string, completed: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('bucket_list')
        .update({ 
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', id)
        .eq('couple_id', coupleId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error toggling item:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('bucket_list')
        .delete()
        .eq('id', id)
        .eq('couple_id', coupleId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting item:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    items,
    loading,
    addItem,
    toggleItem,
    deleteItem,
  };
}
