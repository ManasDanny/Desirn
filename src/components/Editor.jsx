import React from 'react';

const Editor = ({note, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="editor">
      <textarea
        value={note?.content || ''}
        onChange={handleChange}
        placeholder="Write your note here..."
        rows={30}
        cols={50}
        spellCheck="false"
        autoComplete="off"
      />
    </div>
  );
};

export default Editor;