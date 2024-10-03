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
      setProduct('');
      setReadyTime(null);
      setFinishTime(null);
      setTasks({});
    }
  }, [checklist]);

  const handlePreviousDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  const handleNextDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));

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
      <div className="flex items-center justify-between mb-4">
        <Button onClick={handlePreviousDay}><ChevronLeft /></Button>
        <h2 className="text-xl font-bold dark:text-white">{`Checklist - ${formattedDate}`}</h2>
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
          <motion.li 
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <Checkbox
              id={`task-${index}`}
              checked={tasks[index]?.checked || false}
              onCheckedChange={() => toggleTask(index)}
            />
            <label
              htmlFor={`task-${index}`}
              className={`flex-grow cursor-pointer ${tasks[index]?.checked ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}
            >
              {task}
            </label>
            {tasks[index]?.time && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{tasks[index].time}</span>
            )}
          </motion.li>
        ))}
      </ul>
      
      <Button 
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white" 
        onClick={handleReadyClick}
        disabled={!allTasksCompleted || readyTime !== null}
      >
        Ready
      </Button>
      
      {readyTime && (
        <p className="mt-2 text-center text-green-600 dark:text-green-400">
          Pronto às {readyTime}
        </p>
      )}
      
      <Button 
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white" 
        onClick={handleFinishClick}
        disabled={!readyTime || finishTime !== null}
      >
        Finalizar
      </Button>
      
      {finishTime && (
        <p className="mt-2 text-center text-blue-600 dark:text-blue-400">
          Finalizado às {finishTime}
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
