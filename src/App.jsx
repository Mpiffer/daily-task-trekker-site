import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { navItems } from "./nav-items";
import TopMenu from "./components/TopMenu";
import PatchNotes from "./components/PatchNotes";
import Troubleshoot from "./components/Troubleshoot";
import ChecklistLog from "./components/ChecklistLog";
import WIP from "./components/WIP";
import LoadingIndicator from "./components/LoadingIndicator";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular um tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <React.StrictMode>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <TopMenu />
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route key={to} path={to} element={page} />
                ))}
                <Route path="/patch-notes" element={<PatchNotes />} />
                <Route path="/troubleshoot" element={<Troubleshoot />} />
                <Route path="/log" element={<ChecklistLog />} />
                <Route path="/wip" element={<WIP />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </React.StrictMode>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;