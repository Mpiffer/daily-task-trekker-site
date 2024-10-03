import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import TopMenu from "./components/TopMenu";
import PatchNotes from "./components/PatchNotes";
import Troubleshoot from "./components/Troubleshoot";
import ChecklistLog from "./components/ChecklistLog";
import WIP from "./components/WIP";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;