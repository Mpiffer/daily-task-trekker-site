import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from './SearchBar';

const ChecklistLog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['checklistLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Checklist')
        .select('product, ready_time, finish_time, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log =>
      log.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(log.created_at).toLocaleDateString().includes(searchTerm)
    );
  }, [logs, searchTerm]);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Log de Checklists Concluídos</h1>
      <SearchBar
        placeholder="Buscar por produto ou data..."
        onSearch={setSearchTerm}
      />
      <div className="space-y-4">
        {filteredLogs.map((log, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{new Date(log.created_at).toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Produto:</strong> {log.product}</p>
              <p><strong>Horário de início:</strong> {log.ready_time}</p>
              <p><strong>Horário de finalização:</strong> {log.finish_time || 'Não finalizado'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChecklistLog;