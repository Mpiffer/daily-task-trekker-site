import { HomeIcon, ClipboardListIcon, BugIcon, ClockIcon, LightbulbIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import PatchNotes from "./components/PatchNotes.jsx";
import Troubleshoot from "./components/Troubleshoot.jsx";
import ChecklistLog from "./components/ChecklistLog.jsx";
import WIP from "./components/WIP.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Patch Notes",
    to: "/patch-notes",
    icon: <ClipboardListIcon className="h-4 w-4" />,
    page: <PatchNotes />,
  },
  {
    title: "Troubleshoot",
    to: "/troubleshoot",
    icon: <BugIcon className="h-4 w-4" />,
    page: <Troubleshoot />,
  },
  {
    title: "Log",
    to: "/log",
    icon: <ClockIcon className="h-4 w-4" />,
    page: <ChecklistLog />,
  },
  {
    title: "WIP",
    to: "/wip",
    icon: <LightbulbIcon className="h-4 w-4" />,
    page: <WIP />,
  },
];