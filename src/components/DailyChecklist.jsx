import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useChecklist } from '@/integrations/supabase';
import { motion } from 'framer-motion';
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

const DailyChecklist = ({ onUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [product, setProduct] = useState('');
  const [readyTime, setReadyTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [tasks, setTasks] = useState({});
  const { theme, setTheme } = useTheme();

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const { data: checklist, isLoading } = useChecklist(dateKey);

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

  const handleReadyClick = () => {
    if (readyTime) return; // Prevent multiple clicks
    const newReadyTime = new Date().toLocaleTimeString();
    setReadyTime(newReadyTime);
    
    const checklistData = {
      product: product,
      ready_time: newReadyTime,
      tasks: tasks,
      created_at: dateKey
    };

    onUpdate(checklistData);
  };

  const handleFinishClick = () => {
    if (finishTime) return; // Prevent multiple clicks
    const newFinishTime = new Date().toLocaleTimeString();
    setFinishTime(newFinishTime);
    
    const checklistData = {
      product: product,
      ready_time: readyTime,
      finish_time: newFinishTime,
      tasks: tasks,
      created_at: dateKey
    };

    onUpdate(checklistData);
  };

  const allTasksCompleted = Object.keys(tasks).length === defaultTasks.length && 
                            Object.values(tasks).every(task => task.checked);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
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
        {theme === 'dark' ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
    </motion.div>
  );
};

export default DailyChecklist;