import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SearchBar from './SearchBar';

const PatchNotes = () => {
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: patchNotes, isLoading } = useQuery({
    queryKey: ['patchNotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addPatchNote = useMutation({
    mutationFn: async (newNote) => {
      const { data, error } = await supabase
        .from('patch_notes')
        .insert([{ ...newNote, created_at: new Date().toISOString() }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('patchNotes');
      setNewNote({ title: '', description: '' });
    },
  });

  const handleInputChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPatchNote.mutate(newNote);
  };

  const filteredPatchNotes = useMemo(() => {
    if (!patchNotes) return [];
    return patchNotes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patchNotes, searchTerm]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patch Notes</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          type="text"
          name="title"
          value={newNote.title}
          onChange={handleInputChange}
          placeholder="Título da atualização"
          required
        />
        <Textarea
          name="description"
          value={newNote.description}
          onChange={handleInputChange}
          placeholder="Descrição da atualização"
          required
        />
        <Button type="submit" className="w-full">
          Adicionar Patch Note
        </Button>
      </form>

      <SearchBar
        placeholder="Buscar por título ou descrição..."
        onSearch={setSearchTerm}
      />

      <div className="space-y-4">
        {filteredPatchNotes.map((note) => (
          <div key={note.id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-600 text-sm">{new Date(note.created_at).toLocaleString()}</p>
            <p className="mt-2">{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatchNotes;