import React from "react";
import "./NotesApp.css";

// PUBLIC_INTERFACE
/**
 * NoteDetail - displays a note's details, read-only Figma-card style
 * @param {*} props
 *   note: {id, title, content, updated}
 *   onEdit: () => void
 */
function NoteDetail({ note, onEdit }) {
  if (!note) {
    return (
      <div className="note-editor-card" style={{ opacity: 0.83 }}>
        <div className="notes-empty">No note selected</div>
      </div>
    );
  }

  return (
    <div className="note-editor-card">
      <div style={{ fontWeight: 600, fontSize: "1.18rem", marginBottom: 5 }}>
        {note.title || <em>(Untitled)</em>}
      </div>
      <div style={{ fontSize: "1rem", color: "#5f4931" }}>
        {note.content || <span style={{ opacity: 0.5 }}>(Empty note)</span>}
      </div>
      <div style={{ fontWeight: 400, marginTop: 18, fontSize: "0.93em", color: "#b79567" }}>
        Last updated:{" "}
        {note.updated
          ? new Date(note.updated).toLocaleString()
          : "—"}
      </div>
      <div className="note-editor-actions" style={{ marginTop: 18 }}>
        <button className="note-editor-save-btn" type="button" onClick={onEdit}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default NoteDetail;
