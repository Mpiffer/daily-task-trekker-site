import React from 'react';
import { Checkbox } from "@/components/ui/checkbox"

const ChecklistItem = ({ task, onToggle }) => {
  return (
    <li className="flex items-center space-x-2">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.checked}
        onCheckedChange={onToggle}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={`flex-grow ${task.checked ? 'line-through text-gray-500' : ''}`}
      >
        {task.text}
      </label>
      {task.time && (
        <span className="text-sm text-gray-500">{task.time}</span>
      )}
    </li>
  );
};

export default ChecklistItem;