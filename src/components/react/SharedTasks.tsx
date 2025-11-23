import { useState, useRef } from 'react';
import { useTasksSync } from '../../lib/hooks/useTasksSync';

export default function SharedTasks() {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasksSync();
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const result = await addTask(newTask.trim());
    if (result.success) {
      setNewTask('');
      inputRef.current?.focus();
    }
  };

  if (loading) return <div className="shared-tasks"><div className="loading">Cargando tareas...</div></div>;

  return (
    <div className="shared-tasks">
      <h2>📝 Tareas Compartidas</h2>
      <form className="add-task-form" onSubmit={handleAdd}>
        <input ref={inputRef} type="text" placeholder="Nueva tarea..." value={newTask} onChange={(e) => setNewTask(e.target.value)} maxLength={100} />
        <button type="submit">Añadir</button>
      </form>
      {tasks.length === 0 ? (
        <div className="empty">No hay tareas. ¡Añade una! 📋</div>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, !task.completed)} />
              <span className="task-title">{task.title}</span>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .shared-tasks { background: var(--bg-surface); padding: 2rem; border-radius: 24px; box-shadow: var(--shadow-md); border: 2px solid var(--border-secondary); }
        .shared-tasks h2 { font-size: 1.75rem; margin-bottom: 1.5rem; color: var(--text-primary); }
        .add-task-form { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
        .add-task-form input { flex: 1; padding: 0.75rem; border: 2px solid var(--border-primary); border-radius: 12px; font-size: 1rem; background: var(--bg-input); color: var(--text-primary); transition: all 0.3s ease; }
        .add-task-form input::placeholder { color: var(--text-tertiary); }
        .add-task-form input:focus { outline: none; border-color: var(--border-hover); }
        .add-task-form button { padding: 0.75rem 1.5rem; background: var(--gradient-accent); border: none; border-radius: 12px; color: var(--text-inverse); font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
        .add-task-form button:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .tasks-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .empty-tasks { text-align: center; padding: 2rem; color: var(--text-tertiary); }
        .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: var(--bg-elevated); border: 2px solid var(--border-primary); border-radius: 12px; transition: all 0.3s ease; }
        .task-item:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
        .task-item.completed { opacity: 0.6; }
        .task-item.completed .task-text { text-decoration: line-through; }
        .task-checkbox { width: 20px; height: 20px; cursor: pointer; }
        .task-text { flex: 1; color: var(--text-primary); }
        .delete-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; opacity: 0.4; transition: all 0.3s ease; }
        .delete-btn:hover { opacity: 1; transform: scale(1.2); }
        .loading { text-align: center; padding: 2rem; color: #999; }
      `}</style>
    </div>
  );
}
