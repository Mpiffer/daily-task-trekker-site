import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';
import { useTheme } from 'next-themes';
import ChecklistItem from './ChecklistItem';
import DateNavigation from './DateNavigation';
import ReadyFinishButtons from './ReadyFinishButtons';
import SearchBar from './SearchBar';

const defaultTasks = [
  "Verificar os sinais do Restream",
  "Conferir e mudar ordem das cameras no pc principal e no bkp",
  "Verificar se os jogos do dia estão corretos no flowics",
  "Ajustar a macro da intro pra cena de Lobby correta",
  "Ajustar as cenas Ingame e Pregame pra quantidade de Lendas do dia",
  "Setar e preparar o bkp de redundancia, verificar o restream",
  "Abrir transmissão no Disc para as Lendas",
  "Abrir o feed que vai ser usado no Segundo Monitor do pc prinpal e bkp",
  "Abrir a twitch para acompanhar o chat em tempo real e validar como ta a live",
  "Validar se todos os detalhes foram checados"
];

const DailyChecklist = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [product, setProduct] = useState('');
  const [readyTime, setReadyTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [tasks, setTasks] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredTasks = useMemo(() => {
    return defaultTasks.filter(task =>
      task.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const allTasksCompleted = Object.keys(tasks).length === filteredTasks.length && 
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
      
      <SearchBar
        placeholder="Buscar tarefas..."
        onSearch={setSearchTerm}
      />
      
      <ul className="space-y-2">
        {filteredTasks.map((task, index) => (
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
    </div>
  );
};

export default DailyChecklist;
