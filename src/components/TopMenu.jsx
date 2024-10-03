import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Clipboard, AlertTriangle, FileText, Lightbulb } from 'lucide-react';

const TopMenu = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Checklist Diário
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/patch-notes" className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-300">
            <Clipboard className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Patch Notes</span>
          </Link>
          <Link to="/troubleshoot" className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-300">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Troubleshoot</span>
          </Link>
          <Link to="/log" className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-300">
            <FileText className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Log</span>
          </Link>
          <Link to="/wip" className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-300">
            <Lightbulb className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">WIP</span>
          </Link>
          <Button 
            onClick={toggleTheme} 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;