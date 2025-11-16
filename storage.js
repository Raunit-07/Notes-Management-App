const STORAGE_KEY = 'evernote_mvp_notes_v1'

export function loadNotesFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
    return null
  } catch (e) {
    console.log('Error loading notes', e)
    return null
  }
}

export function saveNotesToLocalStorage(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (e) {
    console.log('Error saving notes', e)
  }
}