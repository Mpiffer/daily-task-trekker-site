import React, { useState, useEffect } from 'react';

const PatchNotes = () => {
  const [patchNotes, setPatchNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', description: '' });

  useEffect(() => {
    const savedNotes = localStorage.getItem('patchNotes');
    if (savedNotes) {
      setPatchNotes(JSON.parse(savedNotes));
    }
  }, []);

  const handleInputChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedNotes = [
      { ...newNote, date: new Date().toLocaleDateString() },
      ...patchNotes
    ];
    setPatchNotes(updatedNotes);
    localStorage.setItem('patchNotes', JSON.stringify(updatedNotes));
    setNewNote({ title: '', description: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patch Notes</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="title"
          value={newNote.title}
          onChange={handleInputChange}
          placeholder="Título da atualização"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={newNote.description}
          onChange={handleInputChange}
          placeholder="Descrição da atualização"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Adicionar Patch Note
        </button>
      </form>

      <div>
        {patchNotes.map((note, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-600 text-sm">{note.date}</p>
            <p className="mt-2">{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatchNotes;