import { useState, useEffect } from 'react';
import { useChecklist as useSupabaseChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';

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

const useChecklist = (dateKey) => {
  const [tasks, setTasks] = useState({});
  const [product, setProduct] = useState('');
  const [readyTime, setReadyTime] = useState(null);

  const { data: checklist, refetch } = useSupabaseChecklist(dateKey);
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
      setTasks(Object.fromEntries(defaultTasks.map((text, index) => [
        `task-${index}`,
        { id: `task-${index}`, text, checked: false, time: null }
      ])));
    }
  }, [checklist]);

  const toggleTask = (taskId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        checked: !prevTasks[taskId].checked,
        time: !prevTasks[taskId].checked ? new Date().toLocaleTimeString() : null
      }
    }));
  };

  const handleReadyClick = () => {
    const newReadyTime = new Date().toLocaleTimeString();
    setReadyTime(newReadyTime);
  };

  const saveChecklist = async () => {
    const checklistData = {
      product,
      ready_time: readyTime,
      tasks,
      created_at: dateKey
    };

    try {
      if (checklist && checklist.length > 0) {
        await updateChecklist.mutateAsync({ id: checklist[0].id, ...checklistData });
      } else {
        await addChecklist.mutateAsync(checklistData);
      }
      await refetch();
    } catch (error) {
      console.error("Error saving checklist:", error);
    }
  };

  return { 
    tasks, 
    product, 
    readyTime, 
    setProduct, 
    toggleTask, 
    handleReadyClick,
    saveChecklist
  };
};

export default useChecklist;