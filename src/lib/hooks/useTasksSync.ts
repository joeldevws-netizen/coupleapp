import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useCoupleAuth } from './useCoupleAuth';
import type { Database } from '../types/database.types';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function useTasksSync() {
  const { coupleId, isAuthenticated } = useCoupleAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !coupleId) {
      setLoading(false);
      return;
    }

    fetchTasks();
    subscribeToChanges();
  }, [coupleId, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('tasks')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data || []).map((d: any) => ({ id: d.id, title: d.title, completed: d.completed || false })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('tasks_changes')
      .on('postgres_changes' as any, {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `couple_id=eq.${coupleId}`,
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addTask = async (title: string) => {
    try {
      const newTask: TaskInsert = {
        title,
        couple_id: coupleId!,
        completed: false
      };

      const { error } = await (supabase as any)
        .from('tasks')
        .insert([newTask]);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ completed })
        .eq('id', id)
        .eq('couple_id', coupleId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error toggling task:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('couple_id', coupleId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
  };
}
