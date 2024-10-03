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

  const updateSupabase = async (newData) => {
    try {
      if (checklist && checklist.length > 0) {
        await updateChecklist.mutateAsync({ id: checklist[0].id, ...newData });
      } else {
        await addChecklist.mutateAsync(newData);
      }
      await refetch();
    } catch (error) {
      console.error("Error updating checklist:", error);
    }
  };

  const toggleTask = async (taskId) => {
    const newTasks = {
      ...tasks,
      [taskId]: {
        ...tasks[taskId],
        checked: !tasks[taskId].checked,
        time: !tasks[taskId].checked ? new Date().toLocaleTimeString() : null
      }
    };
    setTasks(newTasks);
    await updateSupabase({ tasks: newTasks, product, ready_time: readyTime, created_at: dateKey });
  };

  const handleProductChange = async (newProduct) => {
    setProduct(newProduct);
    await updateSupabase({ tasks, product: newProduct, ready_time: readyTime, created_at: dateKey });
  };

  const handleReadyClick = async () => {
    const newReadyTime = new Date().toLocaleTimeString();
    setReadyTime(newReadyTime);
    await updateSupabase({ tasks, product, ready_time: newReadyTime, created_at: dateKey });
  };

  return { tasks, product, readyTime, toggleTask, handleProductChange, handleReadyClick };
};

export default useChecklist;