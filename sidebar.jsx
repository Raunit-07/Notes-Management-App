import React, { useState } from 'react'

export default function Sidebar({ categories, counts, selected, onSelect, onCreate, onAddCategory, onRemoveCategory }) {
  const [input, setInput] = useState('')

  function handleAdd() {
    if (input.trim() === '') {
      return
    }
    onAddCategory(input.trim())
    setInput('')
  }

  return (
    <aside className="sidebar">
      <div className="brand">My Notes</div>

      <nav className="categories">
        {categories.map(cat => (
          <div key={cat} className="cat-row">
            <button
              className={`cat-btn ${selected === cat ? 'active' : ''}`}
              onClick={() => onSelect(cat)}
            >
              <span>{cat}</span>
              {cat !== 'All Notes' && (
                <span className="count">{counts[cat] || 0}</span>
              )}
            </button>

            {cat !== 'All Notes' && (
              <button
                className="remove-btn"
                onClick={() => onRemoveCategory(cat)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className="add-category">
        <input
          type="text"
          placeholder="New category"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn small" onClick={handleAdd}>
          Add
        </button>
      </div>

      
    </aside>
  )
}
