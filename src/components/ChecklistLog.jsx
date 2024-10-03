import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChecklistLog = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['checklistLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Checklist')
        .select('product, ready_time, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Log de Checklists Concluídos</h1>
      <div className="space-y-4">
        {logs?.map((log, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{new Date(log.created_at).toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Produto:</strong> {log.product}</p>
              <p><strong>Horário de conclusão:</strong> {log.ready_time}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChecklistLog;