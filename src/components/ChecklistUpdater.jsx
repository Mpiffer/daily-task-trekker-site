import React, { useEffect } from 'react';
import { useChecklist, useAddChecklist, useUpdateChecklist } from '@/integrations/supabase';

const ChecklistUpdater = ({ dateKey, checklistData }) => {
  const { data: checklist, refetch } = useChecklist(dateKey);
  const addChecklist = useAddChecklist();
  const updateChecklist = useUpdateChecklist();

  useEffect(() => {
    const updateSupabase = async () => {
      if (!checklistData.ready_time) return;

      try {
        if (checklist && checklist.length > 0) {
          await updateChecklist.mutateAsync({ id: checklist[0].id, ...checklistData });
        } else {
          await addChecklist.mutateAsync(checklistData);
        }
        await refetch();
      } catch (error) {
        console.error("Error updating checklist:", error);
      }
    };

    updateSupabase();
  }, [checklistData, checklist, dateKey, addChecklist, updateChecklist, refetch]);

  return null;
};

export default ChecklistUpdater;