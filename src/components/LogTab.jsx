import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LogTab = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('readyLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Log de Conclusões</h1>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{log.date}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Produto:</strong> {log.productName}</p>
              <p><strong>Horário de conclusão:</strong> {log.readyTime}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LogTab;