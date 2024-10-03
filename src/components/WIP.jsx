import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WIP = () => {
  const [newIdea, setNewIdea] = useState({ title: '', description: '', importance: 'medium' });
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: ideas, isLoading } = useQuery({
    queryKey: ['wipIdeas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wip_ideas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addIdea = useMutation({
    mutationFn: async (newIdea) => {
      const { data, error } = await supabase
        .from('wip_ideas')
        .insert([newIdea]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('wipIdeas');
      setNewIdea({ title: '', description: '', importance: 'medium' });
    },
  });

  const updateIdeaStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('wip_ideas')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('wipIdeas');
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ ideaId, comment }) => {
      const { data, error } = await supabase
        .from('wip_comments')
        .insert([{ idea_id: ideaId, comment }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('wipIdeas');
      setNewComment('');
    },
  });

  const handleInputChange = (e) => {
    setNewIdea({ ...newIdea, [e.target.name]: e.target.value });
  };

  const handleImportanceChange = (value) => {
    setNewIdea({ ...newIdea, importance: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addIdea.mutate(newIdea);
  };

  const handleStatusUpdate = (id, status) => {
    updateIdeaStatus.mutate({ id, status });
  };

  const handleCommentSubmit = (ideaId) => {
    if (newComment.trim()) {
      addComment.mutate({ ideaId, comment: newComment });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Work in Progress Ideas</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          type="text"
          name="title"
          value={newIdea.title}
          onChange={handleInputChange}
          placeholder="Título da ideia"
          required
        />
        <Textarea
          name="description"
          value={newIdea.description}
          onChange={handleInputChange}
          placeholder="Descrição da ideia"
          required
        />
        <Select name="importance" value={newIdea.importance} onValueChange={handleImportanceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a importância" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full">
          Adicionar Ideia
        </Button>
      </form>

      <div className="space-y-4">
        {ideas?.map((idea) => (
          <div key={idea.id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{idea.title}</h2>
            <p className="text-gray-600 text-sm">Importância: {idea.importance}</p>
            <p className="mt-2">{idea.description}</p>
            <p className="text-gray-500 text-xs mt-2">{new Date(idea.created_at).toLocaleString()}</p>
            <div className="mt-2 space-x-2">
              <Button onClick={() => handleStatusUpdate(idea.id, 'green')} className="bg-green-500 hover:bg-green-600">Verde</Button>
              <Button onClick={() => handleStatusUpdate(idea.id, 'yellow')} className="bg-yellow-500 hover:bg-yellow-600">Amarelo</Button>
              <Button onClick={() => handleStatusUpdate(idea.id, 'red')} className="bg-red-500 hover:bg-red-600">Vermelho</Button>
            </div>
            <div className="mt-4">
              <Textarea
                placeholder="Adicione um comentário"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <Button onClick={() => handleCommentSubmit(idea.id)}>Adicionar Comentário</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WIP;