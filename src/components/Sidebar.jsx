import React, {useRef} from 'react';

const Sidebar = ({ notes, selectedId, onSelect, onCreate, onDelete, onSave, onLoad }) => {
  const fileInputRef = useRef(null)

  const formatTitle = (content) => {
    if (!content || content.trim() === '') return 'Untitled';
    
    const firstLine = content.split('\n')[0];
    const title = firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
    
    return title || 'Untitled';
  };

  const handleDelete = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(noteId);
    }
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    onLoad(e);
    e.target.value = '';
  };

  return (
    <div className="sidebar">
      <button className="create-btn" onClick={onCreate} type="button">
        + Create Note
      </button>
      <button className="save-btn" onClick={onSave} type="button">
        💾 Save Note
      </button>
      <button className="load-btn" onClick={handleLoadClick} type="button">
        📂 Load Note
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      {notes.length === 0 ? (
        <p className="empty-notes"></p>
      ) : (
        <ul className="notes-list">
          {notes.map(note => (
            <li 
              key={note.id} 
              className={`note-item ${note.id === selectedId ? 'selected' : ''}`}
              onClick={() => onSelect(note.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(note.id);
                }
              }}
            >
              <div className="note-content">
                <span className="note-title">
                  {formatTitle(note.content)}
                </span>
              </div>
              <button 
                className="delete-btn" 
                onClick={(e) => handleDelete(e, note.id)}
                type="button"
                aria-label={`Delete note: ${formatTitle(note.content)}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;