import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultTasks = [
  "Revisar e-mails importantes",
  "Realizar chamadas de clientes",
  "Planejar tarefas do dia seguinte",
  "Verificar metas diárias",
  "Organizar documentos",
  "Revisar relatórios financeiros",
  "Analisar feedback de clientes",
  "Preparar apresentações",
  "Participar de reuniões programadas",
  "Atualizar o cronograma de trabalho"
];

const DailyChecklist = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyChecklist');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const handlePreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const toggleTask = (index) => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const updatedTasks = {
      ...tasks,
      [dateKey]: {
        ...tasks[dateKey],
        [index]: !tasks[dateKey]?.[index]
      }
    };
    setTasks(updatedTasks);
    localStorage.setItem('dailyChecklist', JSON.stringify(updatedTasks));
  };

  const dateKey = format(currentDate, 'yyyy-MM-dd');
  const currentTasks = tasks[dateKey] || {};

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={handlePreviousDay}><ChevronLeft /></Button>
        <h2 className="text-xl font-bold">{`Checklist - ${formattedDate}`}</h2>
        <Button onClick={handleNextDay}><ChevronRight /></Button>
      </div>
      
      <ul className="space-y-2">
        {defaultTasks.map((task, index) => (
          <li key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`task-${index}`}
              checked={currentTasks[index] || false}
              onCheckedChange={() => toggleTask(index)}
            />
            <label
              htmlFor={`task-${index}`}
              className={`flex-grow ${currentTasks[index] ? 'line-through text-gray-500' : ''}`}
            >
              {task}
            </label>
          </li>
        ))}
      </ul>
      
      <Button className="mt-4" onClick={() => setShowCalendar(!showCalendar)}>
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