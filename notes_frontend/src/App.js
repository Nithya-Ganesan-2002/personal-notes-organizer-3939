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
      <hr className="notes-header-bar" />
      <main className="notes-main-content">
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
      </main>
      {/* Floating Add Button */}
      <button
        className="notes-add-fab"
        aria-label="Add note"
        title="New note"
        onClick={handleAddNote}
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
