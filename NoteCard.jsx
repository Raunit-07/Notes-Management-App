import React from 'react'

export default function NoteCard({ note, onEdit, onDelete }) {
  function formatDate(dateStr) {
    if (!dateStr) {
      return ''
    }
    const d = new Date(dateStr)
    const date = d.toLocaleDateString()
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return date + ' ' + time
  }

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        {note.pinned && <span className="pin-badge">📌</span>}
      </div>

      <p className="note-description">{note.description}</p>

      <div className="note-footer">
        <div className="note-meta">
          <span className="note-category">{note.category}</span>
          
          {note.tags && note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map((tag) => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="note-actions">
          <button className="icon-btn" onClick={onEdit}>✏️</button>
          <button className="icon-btn" onClick={onDelete}>🗑️</button>
        </div>
      </div>

      <div className="note-date">{formatDate(note.createdAt)}</div>
    </div>
  )
}
