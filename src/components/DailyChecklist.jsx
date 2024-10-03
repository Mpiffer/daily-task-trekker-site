import React, { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChecklistItem from './ChecklistItem';
import useChecklist from '../hooks/useChecklist';

const DailyChecklist = React.memo(() => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  const dateKey = useMemo(() => format(currentDate, 'yyyy-MM-dd'), [currentDate]);
  const formattedDate = useMemo(() => format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }), [currentDate]);

  const { 
    tasks, 
    product, 
    readyTime, 
    setProduct, 
    toggleTask, 
    handleReadyClick,
    saveChecklist
  } = useChecklist(dateKey);

  const handlePreviousDay = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  }, []);

  const handleCalendarToggle = useCallback(() => {
    setShowCalendar(prev => !prev);
  }, []);

  const handleCalendarSelect = useCallback((date) => {
    setCurrentDate(date || new Date());
    setShowCalendar(false);
  }, []);

  const handleProductChange = useCallback((e) => {
    setProduct(e.target.value);
  }, [setProduct]);

  const handleReadyButtonClick = useCallback(() => {
    handleReadyClick();
    saveChecklist();
  }, [handleReadyClick, saveChecklist]);

  const allTasksCompleted = useMemo(() => Object.values(tasks).every(task => task.checked), [tasks]);

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
        onChange={handleProductChange}
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
        onClick={handleReadyButtonClick}
        disabled={!allTasksCompleted || readyTime !== null}
      >
        Ready
      </Button>
      
      {readyTime && (
        <p className="mt-2 text-center text-green-600">
          Pronto às {readyTime}
        </p>
      )}
      
      <Button className="mt-4 w-full" onClick={handleCalendarToggle}>
        {showCalendar ? 'Fechar Calendário' : 'Abrir Calendário'}
      </Button>
      
      {showCalendar && (
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleCalendarSelect}
          className="mt-4"
        />
      )}
    </div>
  );
});

export default DailyChecklist;