import { ReactNode } from "react";
import BottomTabNav from "./BottomTabNav";

interface AppShellProps {
  children: ReactNode;
  /** Hide the bottom tab nav (e.g. inside chat thread / media viewer). */
  hideTabBar?: boolean;
  className?: string;
}

/**
 * Mobile app shell. Owns the persistent bottom tab nav and reserves
 * safe-area padding so screens never need to reason about it.
 */
const AppShell = ({ children, hideTabBar = false, className = "" }: AppShellProps) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      <div
        className={`flex-1 ${hideTabBar ? "" : "pb-[calc(64px+env(safe-area-inset-bottom))]"}`}
      >
        {children}
      </div>
      {!hideTabBar && <BottomTabNav />}
    </div>
  );
};

export default AppShell;