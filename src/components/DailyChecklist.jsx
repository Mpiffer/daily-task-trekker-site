import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

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
  const [productName, setProductName] = useState('');
  const [readyTime, setReadyTime] = useState(null);
  const [completedCard, setCompletedCard] = useState(null);

  const formattedDate = format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'dailyChecklists', dateKey);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTasks(data.tasks || {});
        setProductName(data.productName || '');
        setReadyTime(data.readyTime || null);
      } else {
        setTasks({});
        setProductName('');
        setReadyTime(null);
      }
    };
    fetchData();
  }, [dateKey]);

  const saveData = async (newTasks, newProductName, newReadyTime) => {
    const docRef = doc(db, 'dailyChecklists', dateKey);
    await setDoc(docRef, {
      tasks: newTasks,
      productName: newProductName,
      readyTime: newReadyTime
    }, { merge: true });
  };

  const handlePreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const toggleTask = async (index) => {
    const updatedTasks = {
      ...tasks,
      [index]: {
        ...tasks[index],
        checked: !tasks[index]?.checked,
        time: tasks[index]?.checked ? null : new Date().toLocaleTimeString()
      }
    };
    setTasks(updatedTasks);
    await saveData(updatedTasks, productName, readyTime);
  };

  const handleProductNameChange = async (e) => {
    setProductName(e.target.value);
    await saveData(tasks, e.target.value, readyTime);
  };

  const handleReadyClick = async () => {
    const newReadyTime = new Date().toLocaleTimeString();
    setReadyTime(newReadyTime);
    await saveData(tasks, productName, newReadyTime);
    
    const completedTasks = Object.entries(tasks)
      .filter(([_, task]) => task.checked)
      .map(([index, task]) => `${defaultTasks[index]}: ${task.time}`);
    
    const cardContent = {
      productName,
      date: formattedDate,
      readyTime: newReadyTime,
      completedTasks
    };
    
    setCompletedCard(cardContent);
  };

  const currentTasks = tasks || {};
  const allTasksCompleted = Object.values(currentTasks).every(task => task?.checked);

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
              checked={currentTasks[index]?.checked || false}
              onCheckedChange={() => toggleTask(index)}
            />
            <label
              htmlFor={`task-${index}`}
              className={`flex-grow ${currentTasks[index]?.checked ? 'line-through text-gray-500' : ''}`}
            >
              {task}
            </label>
            {currentTasks[index]?.time && (
              <span className="text-sm text-gray-500">{currentTasks[index].time}</span>
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
      
      {completedCard && (
        <Card className="mt-4 p-4">
          <h3 className="text-lg font-bold">{completedCard.productName}</h3>
          <p>Data: {completedCard.date}</p>
          <p>Concluído às: {completedCard.readyTime}</p>
          <ul className="mt-2">
            {completedCard.completedTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </Card>
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