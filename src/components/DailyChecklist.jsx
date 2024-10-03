import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';
import { useTheme } from 'next-themes';
import ChecklistItem from './ChecklistItem';
import DateNavigation from './DateNavigation';
import ReadyFinishButtons from './ReadyFinishButtons';

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
  const [finishTime, setFinishTime] = useState(null);
  const [tasks, setTasks] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, setTheme } = useTheme();

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const { data: checklist, isLoading, refetch } = useChecklist(dateKey);
  const addChecklist = useAddChecklist();
  const updateChecklist = useUpdateChecklist();

  useEffect(() => {
    if (checklist && checklist.length > 0) {
      const currentChecklist = checklist[0];
      setProduct(currentChecklist.product || '');
      setReadyTime(currentChecklist.ready_time || null);
      setFinishTime(currentChecklist.finish_time || null);
      setTasks(currentChecklist.tasks || {});
    } else {
      resetChecklist();
    }
  }, [checklist]);

  const resetChecklist = () => {
    setProduct('');
    setReadyTime(null);
    setFinishTime(null);
    setTasks({});
  };

  const toggleTask = (index) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [index]: {
        checked: !prevTasks[index]?.checked,
        time: !prevTasks[index]?.checked ? new Date().toLocaleTimeString() : null
      }
    }));
  };

  const handleProductChange = (e) => {
    setProduct(e.target.value);
  };

  const handleReadyClick = async () => {
    if (readyTime || isSubmitting) return;
    setIsSubmitting(true);
    const newReadyTime = new Date().toLocaleTimeString();
    
    const checklistData = {
      product: product,
      ready_time: newReadyTime,
      tasks: tasks,
      created_at: dateKey
    };

    try {
      if (checklist && checklist.length > 0) {
        await updateChecklist.mutateAsync({ id: checklist[0].id, ...checklistData });
      } else {
        await addChecklist.mutateAsync(checklistData);
      }
      setReadyTime(newReadyTime);
      await refetch();
    } catch (error) {
      console.error("Error updating checklist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishClick = async () => {
    if (finishTime || isSubmitting) return;
    setIsSubmitting(true);
    const newFinishTime = new Date().toLocaleTimeString();
    
    const checklistData = {
      product: product,
      ready_time: readyTime,
      finish_time: newFinishTime,
      tasks: tasks,
      created_at: dateKey
    };

    try {
      if (checklist && checklist.length > 0) {
        await updateChecklist.mutateAsync({ id: checklist[0].id, ...checklistData });
      } else {
        await addChecklist.mutateAsync(checklistData);
      }
      setFinishTime(newFinishTime);
      await refetch();
    } catch (error) {
      console.error("Error updating checklist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allTasksCompleted = Object.keys(tasks).length === defaultTasks.length && 
                            Object.values(tasks).every(task => task.checked);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <DateNavigation 
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        formattedDate={formattedDate}
      />
      
      <Input
        type="text"
        placeholder="Nome do Produto"
        value={product}
        onChange={handleProductChange}
        className="mb-4"
      />
      
      <ul className="space-y-2">
        {defaultTasks.map((task, index) => (
          <ChecklistItem
            key={index}
            task={task}
            checked={tasks[index]?.checked || false}
            time={tasks[index]?.time}
            onToggle={() => toggleTask(index)}
          />
        ))}
      </ul>
      
      <ReadyFinishButtons
        allTasksCompleted={allTasksCompleted}
        readyTime={readyTime}
        finishTime={finishTime}
        onReadyClick={handleReadyClick}
        onFinishClick={handleFinishClick}
        isSubmitting={isSubmitting}
      />
      
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

      <Button
        className="mt-4 w-full"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
    </div>
  );
};

export default DailyChecklist;