import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [product, setProduct] = useState('');
  const [readyTime, setReadyTime] = useState(null);
  const [tasks, setTasks] = useState({});

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const { data: checklist, isLoading } = useChecklist(dateKey);
  const addChecklist = useAddChecklist();
  const updateChecklist = useUpdateChecklist();

  useEffect(() => {
    if (checklist && checklist.length > 0) {
      const currentChecklist = checklist[0];
      setProduct(currentChecklist.product || '');
      setReadyTime(currentChecklist.ready_time || null);
      setTasks(currentChecklist.tasks || {});
    } else {
      setProduct('');
      setReadyTime(null);
      setTasks({});
    }
  }, [checklist]);

  const handlePreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const toggleTask = (index) => {
    const updatedTasks = {
      ...tasks,
      [index]: {
        checked: !tasks[index]?.checked,
        time: tasks[index]?.checked ? null : new Date().toLocaleTimeString()
      }
    };
    setTasks(updatedTasks);
  };

  const handleProductChange = (e) => {
    setProduct(e.target.value);
  };

  const handleReadyClick = async () => {
    const newReadyTime = new Date().toLocaleTimeString();
    setReadyTime(newReadyTime);
    
    const checklistData = {
      product: product,
      ready_time: newReadyTime,
      tasks: tasks,
      created_at: dateKey
    };

    if (checklist && checklist.length > 0) {
      await updateChecklist.mutateAsync({ id: checklist[0].id, ...checklistData });
    } else {
      await addChecklist.mutateAsync(checklistData);
    }
    
    // Generate log
    const completedTasks = Object.entries(tasks)
      .filter(([_, task]) => task.checked)
      .map(([index, task]) => `${defaultTasks[index]}: ${task.time}`);
    
    const log = {
      date: formattedDate,
      product: product,
      readyTime: newReadyTime,
      completedTasks: completedTasks
    };
    
    // Save log to localStorage
    const savedLogs = JSON.parse(localStorage.getItem('readyLogs') || '[]');
    savedLogs.push(log);
    localStorage.setItem('readyLogs', JSON.stringify(savedLogs));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const allTasksCompleted = Object.values(tasks).every(task => task?.checked);

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
        {defaultTasks.map((task, index) => (
          <li key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`task-${index}`}
              checked={tasks[index]?.checked || false}
              onCheckedChange={() => toggleTask(index)}
            />
            <label
              htmlFor={`task-${index}`}
              className={`flex-grow ${tasks[index]?.checked ? 'line-through text-gray-500' : ''}`}
            >
              {task}
            </label>
            {tasks[index]?.time && (
              <span className="text-sm text-gray-500">{tasks[index].time}</span>
            )}
          </li>
        ))}
      </ul>
      
      <Button 
        className="mt-4 w-full" 
        onClick={handleReadyClick}
        disabled={!allTasksCompleted}
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