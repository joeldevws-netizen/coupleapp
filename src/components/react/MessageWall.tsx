import { useState, useEffect, useRef } from 'react';
import { useMessagesSync } from '../../lib/hooks/useMessagesSync';
import { useCoupleAuth } from '../../lib/hooks/useCoupleAuth';

export default function MessageWall() {
  const { messages, loading, sendMessage } = useMessagesSync();
  const { partnerName } = useCoupleAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerName) return;
    const result = await sendMessage(newMessage.trim(), partnerName);
    if (result.success) {
      setNewMessage('');
      textareaRef.current?.focus();
    } else {
      alert('Error al enviar mensaje: ' + (result.error || 'Verifica tu conexión'));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  };

  if (loading) return <div className="message-wall"><div className="loading">Cargando mensajes...</div></div>;

  return (
    <div className="message-wall">
      <div className="wall-header">
        <h2>💌 Muro de Mensajes</h2>
        <span className="message-count">{messages.length} mensajes</span>
      </div>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages"><p>No hay mensajes aún. ¡Escribe el primero! 💕</p></div>
        ) : (
          messages.map(message => (
            <div key={message.id} className="message-item">
              <div className="message-header">
                <span className="message-sender">{message.sender_name}</span>
                <span className="message-time">{new Date(message.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="message-form">
        <textarea ref={textareaRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribe un mensaje..." rows={3} maxLength={500} />
        <button type="submit" disabled={!newMessage.trim()}>Enviar 💌</button>
      </form>
      <style>{`
        .message-wall { background: var(--bg-surface); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; height: 600px; border: 2px solid var(--border-secondary); }
        .wall-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .wall-header h2 { font-size: 1.75rem; color: var(--text-primary); margin: 0; }
        .message-count { background: var(--gradient-primary); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; color: var(--accent-pink); border: 2px solid var(--border-primary); }
        .messages-container { flex: 1; overflow-y: auto; margin-bottom: 1.5rem; padding-right: 0.5rem; }
        .messages-container::-webkit-scrollbar { width: 6px; }
        .messages-container::-webkit-scrollbar-track { background: var(--bg-input); border-radius: 10px; }
        .messages-container::-webkit-scrollbar-thumb { background: var(--gradient-accent); border-radius: 10px; }
        .empty-messages { text-align: center; padding: 3rem 1rem; color: var(--text-tertiary); }
        .message-item { background: var(--bg-elevated); border: 2px solid var(--border-primary); border-radius: 16px; padding: 1rem; margin-bottom: 1rem; animation: slideIn 0.3s ease; transition: all 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .message-item:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
        .message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .message-sender { font-weight: 700; color: var(--accent-pink); font-size: 0.95rem; }
        .message-time { font-size: 0.75rem; color: var(--text-tertiary); }
        .message-content { color: var(--text-primary); line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
        .message-form { display: flex; flex-direction: column; gap: 0.75rem; }
        .message-form textarea { padding: 0.75rem; border: 2px solid var(--border-primary); border-radius: 12px; font-size: 1rem; font-family: inherit; resize: vertical; transition: all 0.3s ease; background: var(--bg-input); color: var(--text-primary); }
        .message-form textarea::placeholder { color: var(--text-tertiary); }
        .message-form textarea:focus { outline: none; border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
        .message-form button { padding: 1rem; background: var(--gradient-accent); border: none; border-radius: 12px; color: var(--text-inverse); font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-size: 1rem; }
        .message-form button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .message-form button:disabled { opacity: 0.5; cursor: not-allowed; }
        .loading { text-align: center; padding: 2rem; color: var(--text-tertiary); }
      `}</style>
    </div>
  );
}
