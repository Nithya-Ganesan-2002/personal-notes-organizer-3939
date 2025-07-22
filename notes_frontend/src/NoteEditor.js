import React, { useState, useEffect } from "react";
import "./NotesApp.css";

// PUBLIC_INTERFACE
/**
 * NoteEditor - Editor card to add or edit a note.
 * @param {*} props
 *   visible: boolean, controls display
 *   note: note to edit {id, title, content}
 *   onSave: (noteObj) => void
 *   onCancel: () => void
 */
function NoteEditor({ visible, note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  if (!visible) return null;

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = (t) => (t || "").trim();
    if (!trimmed(title) && !trimmed(content)) return;
    onSave({
      ...note,
      title: trimmed(title),
      content: trimmed(content),
      updated: Date.now(),
    });
  }

  return (
    <form className="note-editor-card" onSubmit={handleSubmit}>
      <input
        className="note-editor-title"
        type="text"
        value={title}
        placeholder="Note title"
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
        maxLength={64}
        autoFocus
      />
      <textarea
        className="note-editor-content"
        value={content}
        placeholder="Write your note here..."
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        aria-label="Note content"
        maxLength={4096}
      />
      <div className="note-editor-actions">
        <button className="note-editor-save-btn" type="submit">
          Save
        </button>
        <button
          className="note-editor-cancel-btn"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default NoteEditor;
