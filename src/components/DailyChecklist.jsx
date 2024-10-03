import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChecklistItem from './ChecklistItem';
import useChecklist from '../hooks/useChecklist';

const DailyChecklist = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [product, setProduct] = useState('');
  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const { tasks, readyTime, toggleTask, handleProductChange, handleReadyClick } = useChecklist(dateKey);

  const handlePreviousDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  const handleNextDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={handlePreviousDay}><ChevronLeft /></Button>
        <h2 className="text-xl font-bold">{`Checklist - ${formattedDate}`}</h2>
        <Button onClick={handleNextDay}><ChevronRight /></Button>
      </div>
      
      <Input
        type="text"
        placeholder="Nome do Produto"
        value={product}
        onChange={(e) => handleProductChange(e.target.value)}
        className="mb-4"
      />
      
      <ul className="space-y-2">
        {Object.entries(tasks).map(([taskId, task]) => (
          <ChecklistItem
            key={taskId}
            task={task}
            onToggle={() => toggleTask(taskId)}
          />
        ))}
      </ul>
      
      <Button 
        className="mt-4 w-full" 
        onClick={handleReadyClick}
        disabled={!Object.values(tasks).every(task => task.checked) || readyTime !== null}
      >
        Ready
      </Button>
      
      {readyTime && (
        <p className="mt-2 text-center text-green-600">
          Pronto às {readyTime}
        </p>
      )}
    </div>
  );
};

export default DailyChecklist;