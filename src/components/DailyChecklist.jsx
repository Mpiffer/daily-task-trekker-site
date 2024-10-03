import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';
import ChecklistItem from './ChecklistItem';
import useChecklist from '../hooks/useChecklist';

const DailyChecklist = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const { 
    tasks, 
    product, 
    readyTime, 
    setProduct, 
    toggleTask, 
    handleReadyClick,
    saveChecklist
  } = useChecklist(dateKey);

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  const handlePreviousDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  const handleNextDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));

  const allTasksCompleted = Object.values(tasks).every(task => task.checked);

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
        onChange={(e) => setProduct(e.target.value)}
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
        onClick={() => {
          handleReadyClick();
          saveChecklist();
        }}
        disabled={!allTasksCompleted || readyTime !== null}
      >
        Ready
      </Button>
      
      {readyTime && (
        <p className="mt-2 text-center text-green-600">
          Pronto às {readyTime}
        </p>
      )}
      
      <Button className="mt-4 w-full" onClick={() => setShowCalendar(!showCalendar)}>
        {showCalendar ? 'Fechar Calendário' : 'Abrir Calendário'}
      </Button>
      
      {showCalendar && (
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => {
            setCurrentDate(date || new Date());
            setShowCalendar(false);
          }}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default DailyChecklist;