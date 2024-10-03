import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useChecklist, useChecklists, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';

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
  const [productName, setProductName] = useState('');
  const [readyTime, setReadyTime] = useState(null);
  const [tasks, setTasks] = useState({});

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const { data: checklists, isLoading } = useChecklists();
  const addChecklist = useAddChecklist();
  const updateChecklist = useUpdateChecklist();

  useEffect(() => {
    if (checklists) {
      const todayChecklist = checklists.find(c => c.created_at.startsWith(dateKey));
      if (todayChecklist) {
        setProductName(todayChecklist.productName || '');
        setReadyTime(todayChecklist.readyTime || null);
        setTasks(todayChecklist.tasks || {});
      } else {
        setProductName('');
        setReadyTime(null);
        setTasks({});
      }
    }
  }, [checklists, dateKey]);

  const handlePreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const toggleTask = async (index) => {
    const updatedTasks = {
      ...tasks,
      [index]: {
        checked: !tasks[index]?.checked,
        time: tasks[index]?.checked ? null : new Date().toLocaleTimeString()
      }
    };
    setTasks(updatedTasks);

    const todayChecklist = checklists?.find(c => c.created_at.startsWith(dateKey));
    if (todayChecklist) {
      await updateChecklist.mutateAsync({ id: todayChecklist.id, tasks: updatedTasks });
    } else {
      await addChecklist.mutateAsync({ tasks: updatedTasks, productName, readyTime });
    }
  };

  const handleProductNameChange = async (e) => {
    setProductName(e.target.value);
    const todayChecklist = checklists?.find(c => c.created_at.startsWith(dateKey));
    if (todayChecklist) {
      await updateChecklist.mutateAsync({ id: todayChecklist.id, productName: e.target.value });
    } else {
      await addChecklist.mutateAsync({ productName: e.target.value, tasks, readyTime });
    }
  };

  const handleReadyClick = async () => {
    const newReadyTime = new Date().toLocaleTimeString();
    setReadyTime(newReadyTime);
    
    const todayChecklist = checklists?.find(c => c.created_at.startsWith(dateKey));
    if (todayChecklist) {
      await updateChecklist.mutateAsync({ id: todayChecklist.id, readyTime: newReadyTime });
    } else {
      await addChecklist.mutateAsync({ readyTime: newReadyTime, tasks, productName });
    }
    
    // Generate log
    const completedTasks = Object.entries(tasks)
      .filter(([_, task]) => task.checked)
      .map(([index, task]) => `${defaultTasks[index]}: ${task.time}`);
    
    const log = {
      date: formattedDate,
      productName: productName,
      readyTime: newReadyTime,
      completedTasks: completedTasks
    };
    
    // Save log to localStorage (you might want to save this to Supabase as well in the future)
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
        value={productName}
        onChange={handleProductNameChange}
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