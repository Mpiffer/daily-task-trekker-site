import React, { useState } from 'react';
import DailyChecklist from '../components/DailyChecklist';
import ChecklistUpdater from '../components/ChecklistUpdater';
import { format } from 'date-fns';

const Index = () => {
  const [checklistData, setChecklistData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleChecklistUpdate = (data) => {
    setChecklistData(data);
  };

  const dateKey = format(currentDate, 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Checklist Diário</h1>
        <DailyChecklist onUpdate={handleChecklistUpdate} currentDate={currentDate} setCurrentDate={setCurrentDate} />
        {checklistData && <ChecklistUpdater dateKey={dateKey} checklistData={checklistData} />}
      </div>
    </div>
  );
};

export default Index;