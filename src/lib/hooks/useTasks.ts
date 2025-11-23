import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useRealtime } from './useRealtime';
import type { Database } from '../types/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

/**
 * Hook para gestionar tareas con sincronización en tiempo real
 * 
 * @param coupleId - ID de la pareja
 * @returns { tasks, loading, addTask, updateTask, deleteTask, toggleTask }
 */
export function useTasks(coupleId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar tareas iniciales
  useEffect(() => {
    if (!coupleId) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [coupleId]);

  // Suscribirse a cambios en tiempo real
  useRealtime<Task>({
    table: 'tasks',
    filter: coupleId ? `couple_id=eq.${coupleId}` : undefined,
    onInsert: (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
    },
    onUpdate: (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    },
    onDelete: ({ old_record }) => {
      setTasks((prev) => prev.filter((task) => task.id !== old_record.id));
    },
  });

  // CRUD Operations
  const addTask = async (title: string) => {
    if (!coupleId) return { error: new Error('No couple ID') };

    const { data: user } = await supabase.auth.getUser();
    
    const newTask: TaskInsert = {
      couple_id: coupleId,
      title,
      created_by: user.user?.id,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask] as any)
      .select()
      .single();

    return { data, error };
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    const supabaseUpdate: any = supabase;
    const { data, error } = await supabaseUpdate
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    return { error };
  };

  const toggleTask = async (id: string, completed: boolean) => {
    return updateTask(id, { completed });
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
