import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Troubleshoot = () => {
  const [newIssue, setNewIssue] = useState({ error: '', solution: '', duration: '' });
  const queryClient = useQueryClient();

  const { data: issues, isLoading } = useQuery({
    queryKey: ['troubleshootIssues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('troubleshoot_issues')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addIssue = useMutation({
    mutationFn: async (newIssue) => {
      const { data, error } = await supabase
        .from('troubleshoot_issues')
        .insert([{ ...newIssue, created_at: new Date().toISOString() }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('troubleshootIssues');
      setNewIssue({ error: '', solution: '', duration: '' });
    },
  });

  const handleInputChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addIssue.mutate(newIssue);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Troubleshoot</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          type="text"
          name="error"
          value={newIssue.error}
          onChange={handleInputChange}
          placeholder="Descrição do erro"
          required
        />
        <Textarea
          name="solution"
          value={newIssue.solution}
          onChange={handleInputChange}
          placeholder="Solução aplicada"
          required
        />
        <Input
          type="text"
          name="duration"
          value={newIssue.duration}
          onChange={handleInputChange}
          placeholder="Duração (ex: 2h30min)"
          required
        />
        <Button type="submit" className="w-full">
          Adicionar Issue
        </Button>
      </form>

      <div className="space-y-4">
        {issues?.map((issue) => (
          <div key={issue.id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{issue.error}</h2>
            <p className="text-gray-600 text-sm">{new Date(issue.created_at).toLocaleString()}</p>
            <p className="mt-2"><strong>Solução:</strong> {issue.solution}</p>
            <p><strong>Duração:</strong> {issue.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Troubleshoot;