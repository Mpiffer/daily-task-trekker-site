import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';

const TopMenu = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Checklist Diário</Link>
        <div className="flex items-center space-x-4">
          <Link to="/patch-notes" className="text-white hover:text-gray-300">Patch Notes</Link>
          <Link to="/troubleshoot" className="text-white hover:text-gray-300">Troubleshoot</Link>
          <Link to="/log" className="text-white hover:text-gray-300">Log</Link>
          <Link to="/wip" className="text-white hover:text-gray-300">WIP</Link>
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> : <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;