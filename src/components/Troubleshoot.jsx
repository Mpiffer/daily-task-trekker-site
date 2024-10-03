import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Troubleshoot = () => {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ error: '', solution: '', duration: '' });

  useEffect(() => {
    const savedIssues = localStorage.getItem('troubleshootIssues');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    }
  }, []);

  const handleInputChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedIssues = [
      { ...newIssue, date: new Date().toLocaleString() },
      ...issues
    ];
    setIssues(updatedIssues);
    localStorage.setItem('troubleshootIssues', JSON.stringify(updatedIssues));
    setNewIssue({ error: '', solution: '', duration: '' });
  };

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
        {issues.map((issue, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{issue.error}</h2>
            <p className="text-gray-600 text-sm">{issue.date}</p>
            <p className="mt-2"><strong>Solução:</strong> {issue.solution}</p>
            <p><strong>Duração:</strong> {issue.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Troubleshoot;