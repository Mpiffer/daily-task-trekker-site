import { useState, useCallback, useEffect } from 'react';
import { useChecklist as useSupabaseChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';

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
      setTasks({
        'task-1': { id: 'task-1', text: 'Revisar e-mails importantes', checked: false, time: null },
        'task-2': { id: 'task-2', text: 'Realizar chamadas de clientes', checked: false, time: null },
        'task-3': { id: 'task-3', text: 'Planejar tarefas do dia seguinte', checked: false, time: null },
        'task-4': { id: 'task-4', text: 'Verificar metas diárias', checked: false, time: null },
        'task-5': { id: 'task-5', text: 'Organizar documentos', checked: false, time: null },
      });
    }
  }, [checklist]);

  const toggleTask = useCallback((taskId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        checked: !prevTasks[taskId].checked,
        time: !prevTasks[taskId].checked ? new Date().toLocaleTimeString() : null
      }
    }));
  }, []);

  const handleReadyClick = useCallback(() => {
    setReadyTime(new Date().toLocaleTimeString());
  }, []);

  const saveChecklist = useCallback(async () => {
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
  }, [product, readyTime, tasks, dateKey, checklist, updateChecklist, addChecklist, refetch]);

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