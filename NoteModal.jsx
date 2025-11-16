import React, { useState, useEffect } from 'react'

export default function NoteModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Personal')
  const [tags, setTags] = useState('')
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title || '')
      setDescription(note.description || '')
      setCategory(note.category || 'Personal')
      if (note.tags) {
        setTags(note.tags.join(', '))
      }
      setPinned(note.pinned || false)
    }
  }, [note])

  function handleSave(e) {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    const tagList = tags.split(',').map(t => t.trim()).filter(t => t.length > 0)

    onSave({
      id: note?.id,
      title: title,
      description: description,
      category: category,
      tags: tagList,
      pinned: pinned
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{note ? 'Edit Note' : 'New Note'}</h3>
          <button className="close" onClick={onClose}>×</button>
        </header>

        <form className="modal-body" onSubmit={handleSave}>
          <label className="field">
            <div className="label">Title</div>
            <input 
              type="text"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="field">
            <div className="label">Description</div>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </label>

          <label className="field">
            <div className="label">Category</div>
            <input 
              type="text"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>

          <label className="field">
            <div className="label">Tags (comma separated)</div>
            <input 
              type="text"
              value={tags} 
              onChange={(e) => setTags(e.target.value)}
            />
          </label>

          <label className="field checkbox-field">
            <input 
              type="checkbox" 
              checked={pinned} 
              onChange={() => setPinned(!pinned)} 
            />
            <span>Pin this note</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
