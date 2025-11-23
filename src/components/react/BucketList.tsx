import { useState } from 'react';
import { useBucketList } from '../../lib/hooks/useBucketList';

const categoryEmojis = { travel: '✈️', activity: '🎯', food: '🍽️', adventure: '🏔️', other: '💫' };
const categoryLabels = { travel: 'Viaje', activity: 'Actividad', food: 'Gastronomía', adventure: 'Aventura', other: 'Otros' };
const priorityColors = { high: '#ff6b9d', medium: '#ffa726', low: '#9e9e9e' };
const priorityLabels = { high: 'Alta', medium: 'Media', low: 'Baja' };

export default function BucketList() {
  const { items, loading, addItem, toggleItem, deleteItem } = useBucketList();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'travel' as any, priority: 'medium' as any, notes: '' });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const result = await addItem({ 
      title: formData.title.trim(), 
      category: formData.category, 
      priority: formData.priority, 
      notes: formData.notes.trim() 
    });

    if (result.success) {
      setFormData({ title: '', category: 'travel', priority: 'medium', notes: '' });
      setShowAddForm(false);
    } else {
      alert('Error al guardar: ' + (result.error || 'Verifica tu conexión o que las tablas de base de datos existan'));
    }
  };

  const filteredItems = items.filter(item => {
    const statusMatch = filter === 'all' || (filter === 'active' && !item.completed) || (filter === 'completed' && item.completed);
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const completed = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? (completed / items.length) * 100 : 0;

  if (loading) return <div className="bucket-list"><div className="loading">Cargando...</div></div>;

  return (
    <div className="bucket-list">
      <div className="bucket-header">
        <h2>🌟 Bucket List</h2>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? '✕' : '+ Añadir'}</button>
      </div>

      {showAddForm && (
        <form className="add-form" onSubmit={handleAddItem}>
          <input type="text" placeholder="Título" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} maxLength={50} required />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})}>
            {Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{categoryEmojis[key as keyof typeof categoryEmojis]} {label}</option>)}
          </select>
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as any})}>
            {Object.entries(priorityLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <textarea placeholder="Notas (opcional)" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} maxLength={200} />
          <button type="submit">Guardar Sueño</button>
        </form>
      )}

      <div className="progress-section">
        <div className="progress-info">
          <span>{completed} de {items.length} logrados</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{width: `${progress}%`}} /></div>
      </div>

      <div className="filters">
        {['all', 'active', 'completed'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f as any)}>
            {f === 'all' ? 'Todas' : f === 'active' ? 'Pendientes' : 'Logradas'} ({f === 'all' ? items.length : f === 'active' ? items.length - completed : completed})
          </button>
        ))}
      </div>

      <div className="category-filters">
        {['all', ...Object.keys(categoryLabels)].map(cat => (
          <button key={cat} className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`} onClick={() => setCategoryFilter(cat)}>
            {cat === 'all' ? '🌈 Todas' : `${categoryEmojis[cat as keyof typeof categoryEmojis]} ${categoryLabels[cat as keyof typeof categoryLabels]}`}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty">No hay sueños en esta categoría 💭</div>
      ) : (
        <div className="items-grid">
          {filteredItems.map(item => (
            <div key={item.id} className={`item ${item.completed ? 'completed' : ''}`}>
              <div className="item-header">
                <input type="checkbox" checked={item.completed} onChange={() => toggleItem(item.id, !item.completed)} />
                <span className="item-title">{item.title}</span>
                <button className="delete-btn" onClick={() => deleteItem(item.id)}>🗑️</button>
              </div>
              <div className="item-meta">
                <span className="category">{categoryEmojis[item.category]} {categoryLabels[item.category]}</span>
                <span className="priority" style={{color: priorityColors[item.priority]}}>{priorityLabels[item.priority]}</span>
              </div>
              {item.notes && <p className="notes">{item.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .bucket-list { background: var(--bg-surface); padding: 2rem; border-radius: 24px; box-shadow: var(--shadow-md); border: 2px solid var(--border-secondary); }
        .bucket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .bucket-header h2 { margin: 0; font-size: 2rem; color: var(--text-primary); font-weight: 800; }
        .add-btn { padding: 0.75rem 1.5rem; background: var(--gradient-accent); border: none; border-radius: 12px; color: var(--text-inverse); font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .add-form { background: var(--gradient-subtle); border: 2px solid var(--border-primary); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
        .add-form input, .add-form select, .add-form textarea { padding: 0.75rem; border: 2px solid var(--border-primary); border-radius: 8px; font-size: 1rem; background: var(--bg-input); color: var(--text-primary); }
        .add-form input::placeholder, .add-form textarea::placeholder { color: var(--text-tertiary); }
        .add-form input:focus, .add-form select:focus, .add-form textarea:focus { outline: none; border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
        .add-form button { padding: 1rem; background: var(--gradient-accent); border: none; border-radius: 12px; color: var(--text-inverse); font-weight: 700; cursor: pointer; }
        .progress-section { margin-bottom: 2rem; }
        .progress-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-secondary); }
        .progress-bar { height: 12px; background: var(--bg-input); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--gradient-accent); transition: width 0.5s ease; border-radius: 10px; }
        .filters, .category-filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .filter-btn, .cat-btn { padding: 0.5rem 1rem; background: var(--bg-elevated); border: 2px solid var(--border-secondary); border-radius: 20px; cursor: pointer; font-size: 0.875rem; font-weight: 600; transition: all 0.3s ease; color: var(--text-primary); }
        .filter-btn:hover, .cat-btn:hover { border-color: var(--border-primary); }
        .filter-btn.active, .cat-btn.active { background: var(--gradient-primary); border-color: var(--border-hover); color: var(--accent-pink); }
        .empty { text-align: center; padding: 3rem; color: var(--text-tertiary); font-size: 1.1rem; }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .item { background: var(--bg-elevated); border: 2px solid var(--border-primary); border-radius: 16px; padding: 1.25rem; transition: all 0.3s ease; }
        .item:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); transform: translateY(-4px); }
        .item.completed { opacity: 0.6; }
        .item.completed .item-title { text-decoration: line-through; }
        .item-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .item-header input { cursor: pointer; width: 20px; height: 20px; }
        .item-title { flex: 1; font-weight: 700; color: var(--text-primary); }
        .delete-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; opacity: 0.4; transition: all 0.3s ease; }
        .delete-btn:hover { opacity: 1; transform: scale(1.2); }
        .item-meta { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .category { color: var(--text-secondary); font-weight: 600; }
        .priority { font-weight: 700; }
        .notes { margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; }
        .loading { text-align: center; padding: 2rem; color: var(--text-tertiary); }
        @media (max-width: 640px) { .bucket-list { padding: 1.5rem; } .items-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
