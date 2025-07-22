import React from "react";
import "./NotesApp.css";

// PUBLIC_INTERFACE
/**
 * NotesList - Lists and allows selection and deletion of notes.
 * @param {*} props
 *   notes: Array of notes [{id, title, content, updated}]
 *   selectedNoteId: the current selected note id
 *   onSelect: function (id) => void
 *   onDelete: function (id) => void
 *   search: current search string
 *   onSearchChange: function (e) => void
 */
function NotesList({
  notes,
  selectedNoteId,
  onSelect,
  onDelete,
  search,
  onSearchChange,
}) {
  return (
    <div className="notes-list-card" aria-label="Notes list">
      <input
        type="search"
        className="notes-search-box"
        placeholder="Search notes..."
        value={search}
        onChange={onSearchChange}
        aria-label="Search notes"
      />
      {notes.length === 0 ? (
        <div className="notes-empty">No notes found.</div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`note-list-item${note.id === selectedNoteId ? " selected" : ""}`}
            onClick={() => onSelect(note.id)}
            tabIndex={0}
            aria-label={note.title || "(untitled note)"}
            onKeyPress={(e) => {
              if (e.key === "Enter") onSelect(note.id);
            }}
          >
            <span className="note-title">{note.title || <em>(untitled)</em>}</span>
            <button
              className="note-delete-btn"
              aria-label="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              tabIndex={0}
            >
              &times;
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default NotesList;
