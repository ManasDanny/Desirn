import { useState, useCallback, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Sidebar from './components/Sidebar';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')).notes : [{
      id: uuidv4(),
      content: "Example note \n Example function using inline math: $f(x) = x + y$ \n Example inline code: `x += 1` \n Katex Guide: https://katex.org/docs/api"
    }]
  })

  const [selectedId, setSelectedId] = useState(() => {
    return localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')).selectedId : null
  })

  useEffect(() => {
    try {
      const dataToSave = { notes, selectedId };
      localStorage.setItem('notes', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  }, [notes, selectedId]);

  const selectedNote = notes.find(note => note.id === selectedId)

  const createNote = () => {
    const newNote = {
      id: uuidv4(),
      content: ''
    }
    setNotes([newNote, ...notes])
    setSelectedId(newNote.id)
  }

  const updateNote = (id, newContent) => {
    setNotes(prev => prev.map(note => (note.id === id ? {...note, content: newContent} : note)))
  }

  const deleteNote = (id) => {
    const remainingNotes = notes.filter(note => note.id !== id)

    setNotes(remainingNotes)

    if (id === selectedId) {
      setSelectedId(remainingNotes.length > 0 ? remainingNotes[0].id : null)
    }
    
  }

  const handleEditorChange = useCallback((content) => {
    if (selectedId) {
      updateNote(selectedId, content);
    }
  }, [selectedId, updateNote]);

  const handleSave = () => {
    const currentNote = notes.find(note => note.id === selectedId)
    if (!currentNote) return

    const content = currentNote.content
    const blob = new Blob([content], {type: 'text/markdown'})
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url

    const firstLine = content.split('\n')[0].trim();
    const filename = firstLine 
      ? `${firstLine.substring(0, 30).replace(/[^\w\s-]/g, '')}.md`
      : 'note.md';

    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
  }

  const handleLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      alert('Please select a markdown file (.md or .markdown)');
      return;
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const newNote = {
        id: uuidv4(),
        content: event.target.result
      }
      setNotes(prevNotes => [newNote, ...prevNotes])
    setSelectedId(newNote.id)
    }
    reader.readAsText(file)
  }

  return (
    <div className="app">
      <Sidebar
      notes = {notes}
      selectedId = {selectedId}
      onSelect = {setSelectedId}
      onCreate = {createNote}
      onDelete = {deleteNote}
      onSave = {handleSave}
      onLoad = {handleLoad}
      />
      <div className="main">
        {notes.length > 0 && selectedNote ? (
          <>
            <Editor
              note={selectedNote}
              onChange={handleEditorChange}
            />
            <Preview content={selectedNote.content || ''} />
          </>
        ) : (
          <div className="empty-main">
            <div className="welcome-message">
              <p>Welcome to Desirn. View the example note and create your first note to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
