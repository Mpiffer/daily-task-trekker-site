import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from "@/components/ui/checkbox"

const ChecklistItem = ({ task, checked, time, onToggle }) => {
  return (
    <motion.li 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
    >
      <Checkbox
        id={`task-${task}`}
        checked={checked}
        onCheckedChange={onToggle}
      />
      <label
        htmlFor={`task-${task}`}
        className={`flex-grow cursor-pointer ${checked ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}
      >
        {task}
      </label>
      {time && (
        <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
      )}
    </motion.li>
  );
};

export default ChecklistItem;