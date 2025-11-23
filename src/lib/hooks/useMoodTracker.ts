import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useCoupleAuth } from './useCoupleAuth';
import type { Database } from '../types/database.types';

export type Mood = 'amazing' | 'happy' | 'okay' | 'sad' | 'stressed';

type MoodEntry = Database['public']['Tables']['mood_entries']['Row'];

interface PartnerMoods {
  myMood: Mood | null;
  partnerMood: Mood | null;
}

/**
 * Hook para gestionar mood tracker con sincronización en tiempo real
 * Muestra el mood actual de cada miembro de la pareja
 */
export function useMoodTracker() {
  const { coupleId, partnerName } = useCoupleAuth();
  const [moods, setMoods] = useState<PartnerMoods>({
    myMood: null,
    partnerMood: null
  });
  const [loading, setLoading] = useState(true);

  // Cargar moods actuales (el más reciente de cada persona)
  useEffect(() => {
    if (!coupleId || !partnerName) {
      setLoading(false);
      return;
    }

    const fetchCurrentMoods = async () => {
      // Obtener el mood más reciente de cada partner
      const { data, error } = await (supabase as any)
        .from('mood_entries')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })
        .limit(10); // Obtener últimos 10 para asegurar que tenemos de ambos

      if (error) {
        console.error('Error fetching moods:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Encontrar el mood más reciente de cada persona
        const myLatestMood = (data as any[]).find(m => m.partner_name === partnerName);
        const partnerLatestMood = (data as any[]).find(m => m.partner_name !== partnerName);

        setMoods({
          myMood: myLatestMood?.mood as Mood || null,
          partnerMood: partnerLatestMood?.mood as Mood || null
        });
      }
      
      setLoading(false);
    };

    fetchCurrentMoods();
  }, [coupleId, partnerName]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!coupleId) return;

    const channel = supabase
      .channel('mood_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_entries',
          filter: `couple_id=eq.${coupleId}`
        },
        (payload) => {
          const newMood = payload.new as MoodEntry;
          
          // Actualizar el mood correspondiente
          setMoods(prev => {
            if (newMood.partner_name === partnerName) {
              return { ...prev, myMood: newMood.mood as Mood };
            } else {
              return { ...prev, partnerMood: newMood.mood as Mood };
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, partnerName]);

  // Guardar mood
  const setMood = async (mood: Mood, note?: string) => {
    if (!coupleId || !partnerName) {
      return { success: false, error: new Error('No couple ID or partner name') };
    }

    const { data, error } = await (supabase as any)
      .from('mood_entries')
      .insert([{
        couple_id: coupleId,
        partner_name: partnerName,
        mood: mood,
        note: note || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error setting mood:', error);
      return { success: false, error };
    }

    // Actualizar estado local inmediatamente
    setMoods(prev => ({ ...prev, myMood: mood }));

    return { success: true, data };
  };

  return {
    myMood: moods.myMood,
    partnerMood: moods.partnerMood,
    loading,
    setMood
  };
}
