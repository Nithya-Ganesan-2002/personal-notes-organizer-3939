import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import "./NotesApp.css";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import NoteDetail from "./NoteDetail";

// Generate a unique ID for notes
function generateId() {
  // Simple ID: timestamp + random for demo
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// PUBLIC_INTERFACE
/**
 * App - Main Note Taking UI, Figma-style modern and responsive.
 * Features: create, edit, delete, search, select, list, view notes.
 */
function App() {
  // Theme state (retained for future toggle)
  const [theme, setTheme] = useState("light");

  // Notes model: Array<{id, title, content, updated}>
  const [notes, setNotes] = useState(() => {
    // Try load from localStorage for persistence
    const stored = localStorage.getItem("notes-v1");
    return stored ? JSON.parse(stored) : [];
  });

  // Track selected note id and states
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Explicitly show/hide all notes list
  const [showAll, setShowAll] = useState(false);

  // Effect for localStorage persistence
  useEffect(() => {
    localStorage.setItem("notes-v1", JSON.stringify(notes));
  }, [notes]);

  // Effect to apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Filtered notes for search
  const filteredNotes = notes
    .filter((n) =>
      (n.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (n.content || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => (b.updated || 0) - (a.updated || 0)); // Most recent first

  // PUBLIC_INTERFACE
  // Save (add or update) a note
  const handleSaveNote = (newNote) => {
    if (newNote.id) {
      // Existing: update
      setNotes((notes) =>
        notes.map((n) => (n.id === newNote.id ? { ...n, ...newNote } : n))
      );
      setSelectedId(newNote.id);
    } else {
      // New note
      const id = generateId();
      const n = { ...newNote, id, updated: Date.now() };
      setNotes((notes) => [n, ...notes]);
      setSelectedId(id);
    }
    setIsAdding(false);
    setIsEditing(false);
  };

  // PUBLIC_INTERFACE
  // Select note
  const handleSelectNote = (id) => {
    setSelectedId(id);
    setIsEditing(false);
    setIsAdding(false);
  };

  // PUBLIC_INTERFACE
  // Delete note by id
  const handleDeleteNote = (id) => {
    if (window.confirm("Delete this note?")) {
      setNotes((notes) => notes.filter((n) => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setIsEditing(false);
      }
    }
  };

  // PUBLIC_INTERFACE
  // Begin adding a new note
  const handleAddNote = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedId(null);
  };

  // PUBLIC_INTERFACE
  // Begin editing selected note
  const handleEditNote = () => {
    setIsEditing(true);
    setIsAdding(false);
  };

  // PUBLIC_INTERFACE
  // Cancel add/edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
  };

  // Get current selected note
  const selectedNote = notes.find((n) => n.id === selectedId);

  return (
    <div className="notes-app-container">
      <header className="notes-header">
        <span>Personal Notes Organizer</span>
      </header>
      {/* NEW: All Notes Button/Option, modern style */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
          marginBottom: 0,
          gap: "1.3em",
          alignItems: "center",
        }}
      >
        <button
          className={`notes-listall-btn${showAll ? " active" : ""}`}
          aria-pressed={showAll}
          onClick={() => setShowAll((prev) => !prev)}
          style={{
            background:
              showAll
                ? "linear-gradient(90deg, #1976d2 80%, #fbc02d 100%)"
                : "#1976d2",
            color: "#fff",
            padding: "0.64em 1.6em",
            borderRadius: "22px",
            fontWeight: 600,
            border: "none",
            fontSize: "1.07rem",
            marginBottom: "0.3em",
            boxShadow: showAll
              ? "0 4px 18px #1976d244"
              : "0 2px 8px #2222",
            transition: "background 0.28s, box-shadow 0.20s",
            cursor: "pointer",
            outline: showAll ? "2px solid #fbc02d" : "none",
          }}
        >
          {showAll ? "Hide All Notes" : "List All Notes"}
        </button>
        {/* 'New Note' action added here for accessibility */}
        <button
          className="notes-listall-add"
          style={{
            background: "#fbc02d",
            color: "#322016",
            padding: "0.53em 1.48em",
            borderRadius: "22px",
            fontWeight: 600,
            border: "none",
            fontSize: "1.07rem",
            marginBottom: "0.3em",
            boxShadow: "0 2px 12px #faa41c44",
            transition: "background 0.18s, box-shadow 0.12s",
            cursor: "pointer",
          }}
          onClick={handleAddNote}
        >
          + New note
        </button>
      </div>
      <hr className="notes-header-bar" />
      <main className="notes-main-content">
        {showAll ? (
          // Show ALL notes, sorted by recent, no search bar, only a minimal list
          <div className="notes-listall-card" style={{
            border: "4px solid #348fea",
            borderRadius: 24,
            boxShadow: "0 6px 24px #1567ba18",
            background: "#f6f9fc",
            minHeight: 320,
            maxHeight: 520,
            overflowY: "auto",
            width: 380,
            marginBottom: 20,
            marginTop: 8,
            padding: "18px 0 18px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{
              fontWeight: 600,
              fontSize: "1.32rem",
              marginBottom: 12,
              letterSpacing: "0.03em",
              color: "#1976d2"
            }}>
              All Saved Notes
            </div>
            {notes.length === 0 ? (
              <div className="notes-empty" style={{marginTop: 54, marginBottom: 59, fontSize: "1.07em"}}>No notes saved yet.</div>
            ) : (
              notes
                .slice() // shallow copy
                .sort((a, b) => (b.updated || 0) - (a.updated || 0))
                .map((note) => (
                  <div
                    key={note.id}
                    className={`note-list-item${note.id === selectedId ? " selected" : ""}`}
                    style={{
                      width: "92%",
                      margin: "0 auto 6px auto",
                      fontSize: "1.1rem",
                      border: "2px solid #faf3e5",
                      background: "#fffced",
                      borderRadius: 8,
                      padding: "12px 14px 11px 18px",
                      color: "#322016",
                      display: "flex",
                      alignItems: "center",
                      transition: "box-shadow 0.13s, background 0.13s, border 0.12s",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setShowAll(false);
                      handleSelectNote(note.id);
                    }}
                  >
                    <span className="note-title" style={{
                      flex: "1 1 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: note.id === selectedId ? 700 : 500
                    }}>{note.title || <em>(untitled)</em>}</span>
                    <span style={{
                      minWidth: 116, fontSize: "0.96em", opacity: 0.45, marginLeft: 17,
                      textAlign: "right"
                    }}>
                      {note.updated ? new Date(note.updated).toLocaleDateString() : ""}
                    </span>
                  </div>
                ))
            )}
          </div>
        ) : (
          // Default note list + right column
          <>
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedId}
              onSelect={handleSelectNote}
              onDelete={handleDeleteNote}
              search={search}
              onSearchChange={(e) => setSearch(e.target.value)}
            />
            {isAdding ? (
              <NoteEditor
                visible={true}
                note={{ title: "", content: "" }}
                onSave={handleSaveNote}
                onCancel={handleCancelEdit}
              />
            ) : isEditing && selectedNote ? (
              <NoteEditor
                visible={true}
                note={selectedNote}
                onSave={handleSaveNote}
                onCancel={handleCancelEdit}
              />
            ) : (
              <NoteDetail note={selectedNote} onEdit={handleEditNote} />
            )}
          </>
        )}
      </main>
      {/* Floating Add Button */}
      {/* Floating Add Button */}
      <button
        className="notes-add-fab"
        aria-label="Add note"
        title="New note"
        onClick={() => {
          // Always open add form and close editors for clean UX, ignore if already open
          setIsAdding(true);
          setIsEditing(false);
          setSelectedId(null);
        }}
        style={{
          position: "fixed",
          right: 54,
          bottom: 58,
          background: "var(--accent)",
          color: "#322016",
          border: "none",
          borderRadius: "50%",
          boxShadow: "0 4px 24px #fc3e0a25",
          width: 68,
          height: 68,
          fontSize: "2.4rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "box-shadow 0.18s, background 0.22s",
          zIndex: 3,
        }}
      >
        +
      </button>
      {/* Theme toggle retained as example */}
      <button
        className="theme-toggle"
        onClick={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ top: 22, right: 22, zIndex: 99, position: "fixed" }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}

export default App;
