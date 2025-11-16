import React, { useEffect, useState } from 'react'
import Sidebar from '../src/sidebar'
import NoteCard from '../NoteCard'
import NoteModal from '../NoteModal'
import { loadNotesFromLocalStorage, saveNotesToLocalStorage } from '../storage'

export default function App() {
  const [notes, setNotes] = useState([])
  const [categories, setCategories] = useState(['All Notes', 'Work', 'Personal', 'Ideas'])
  const [selectedCategory, setSelectedCategory] = useState('All Notes')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load notes from storage
  useEffect(() => {
    const saved = loadNotesFromLocalStorage()
    
    if (saved && Array.isArray(saved)) {
      setNotes(saved)
    } else {
      // Load from JSON if no saved notes
      fetch('/notes.json')
        .then(res => res.json())
        .then(data => {
          setNotes(data)
          saveNotesToLocalStorage(data)
        })
        .catch(err => console.log('Error loading notes', err))
    }
  }, [])

  // Save notes to storage when they change
  useEffect(() => {
    saveNotesToLocalStorage(notes)
  }, [notes])

  function saveNote(noteData) {
    let updated = false
    let newNotes = notes

    if (noteData.id == null) {
      // New note
      const ids = notes.map(n => n.id)
      const maxId = ids.length > 0 ? Math.max(...ids) : 0
      const newNote = {
        ...noteData,
        id: maxId + 1,
        createdAt: new Date().toISOString()
      }
      newNotes = [newNote, ...notes]
      updated = true
    } else {
      // Edit existing note
      newNotes = notes.map(n => {
        if (n.id === noteData.id) {
          return { ...n, ...noteData }
        }
        return n
      })
      updated = true
    }

    // Add new category if it doesn't exist
    if (!categories.includes(noteData.category)) {
      setCategories([...categories, noteData.category])
    }

    if (updated) {
      setNotes(newNotes)
    }

    setModalOpen(false)
  }

  function deleteNote(id) {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  function getCategoryCount(cat) {
    return notes.filter(n => n.category === cat).length
  }

  function getFilteredNotes() {
    let result = notes

    // Filter by category
    if (selectedCategory !== 'All Notes') {
      result = result.filter(n => n.category === selectedCategory)
    }

    // Filter by search
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase()
      result = result.filter(n => {
        return n.title.toLowerCase().includes(search) || 
               n.description.toLowerCase().includes(search)
      })
    }

    // Sort by pinned
    result.sort((a, b) => {
      if (b.pinned && !a.pinned) return 1
      if (a.pinned && !b.pinned) return -1
      return 0
    })

    return result
  }

  const counts = {}
  categories.forEach(cat => {
    counts[cat] = getCategoryCount(cat)
  })

  return (
    <div className="app-root">
      <Sidebar
        categories={categories}
        counts={counts}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        onCreate={() => {
          setEditingNote(null)
          setModalOpen(true)
        }}
        onAddCategory={(name) => {
          setCategories([...categories, name])
        }}
        onRemoveCategory={(name) => {
          if (name === 'All Notes') return
          if (window.confirm('Remove this category?')) {
            setCategories(categories.filter(c => c !== name))
          }
        }}
      />

      <main className="main-area">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <header className="main-header">
          <h2>{selectedCategory}</h2>
          <button className="btn" onClick={() => {
            setEditingNote(null)
            setModalOpen(true)
          }}>
            + New Note
          </button>
        </header>

        <section className="notes-grid">
          {getFilteredNotes().length === 0 ? (
            <div className="empty">No notes found.</div>
          ) : (
            getFilteredNotes().map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => {
                  setEditingNote(note)
                  setModalOpen(true)
                }}
                onDelete={() => deleteNote(note.id)}
              />
            ))
          )}
        </section>
      </main>

      {modalOpen && (
        <NoteModal
          note={editingNote}
          onClose={() => setModalOpen(false)}
          onSave={saveNote}
        />
      )}
    </div>
  )
}
