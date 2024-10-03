import React from 'react';
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateNavigation = ({ currentDate, setCurrentDate, formattedDate }) => {
  const handlePreviousDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  const handleNextDay = () => setCurrentDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));

  return (
    <div className="flex items-center justify-between mb-4">
      <Button onClick={handlePreviousDay}><ChevronLeft /></Button>
      <h2 className="text-xl font-bold dark:text-white">{`Checklist - ${formattedDate}`}</h2>
      <Button onClick={handleNextDay}><ChevronRight /></Button>
    </div>
  );
};

export default DateNavigation;