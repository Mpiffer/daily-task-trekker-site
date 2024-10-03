import React from 'react';
import { Button } from "@/components/ui/button"

const ReadyFinishButtons = ({ allTasksCompleted, readyTime, finishTime, onReadyClick, onFinishClick }) => {
  return (
    <>
      <Button 
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white" 
        onClick={onReadyClick}
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
        onClick={onFinishClick}
        disabled={!readyTime || finishTime !== null}
      >
        Finalizar
      </Button>
      
      {finishTime && (
        <p className="mt-2 text-center text-blue-600 dark:text-blue-400">
          Finalizado às {finishTime}
        </p>
      )}
    </>
  );
};

export default ReadyFinishButtons;