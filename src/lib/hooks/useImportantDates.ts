import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useCoupleAuth } from './useCoupleAuth';
import type { Database } from '../types/database.types';

type ImportantDateRow = Database['public']['Tables']['important_dates']['Row'];
type ImportantDateInsert = Database['public']['Tables']['important_dates']['Insert'];

interface ImportantDate {
  id: string;
  title: string;
  date: string;
  type: 'anniversary' | 'birthday' | 'special' | 'recurring';
  icon: string;
  description?: string;
}

const STORAGE_KEY = 'couple-app-dates-backup';

export function useImportantDates() {
  const { coupleId, isAuthenticated } = useCoupleAuth();
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDates = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('important_dates')
        .select('*')
        .eq('couple_id', coupleId)
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedDates = (data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        date: d.date,
        type: d.type as ImportantDate['type'],
        icon: d.icon,
        description: d.description || undefined,
      }));

      setDates(formattedDates);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedDates));
    } catch (error) {
      console.error('Error fetching dates:', error);
      // Fallback to localStorage
      const backup = localStorage.getItem(STORAGE_KEY);
      if (backup) setDates(JSON.parse(backup));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !coupleId) {
      setLoading(false);
      return;
    }

    fetchDates();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('important_dates_changes')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'important_dates',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchDates();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, isAuthenticated]);

  const addDate = async (date: Omit<ImportantDate, 'id'>) => {
    try {
      const newDate: ImportantDateInsert = {
        couple_id: coupleId!,
        title: date.title,
        date: date.date,
        type: date.type,
        icon: date.icon,
        description: date.description
      };

      const { data, error } = await (supabase as any)
        .from('important_dates')
        .insert([newDate])
        .select()
        .single();

      if (error) throw error;

      // Immediately fetch to show the new date
      await fetchDates();

      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding date:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteDate = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('important_dates')
        .delete()
        .eq('id', id)
        .eq('couple_id', coupleId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting date:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    dates,
    loading,
    addDate,
    deleteDate,
  };
}
