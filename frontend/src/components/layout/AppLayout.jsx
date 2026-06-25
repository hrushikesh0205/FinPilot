import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';

export function AppLayout({ children, currentPage, setCurrentPage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Navbar collapsed={collapsed} />
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          'pl-0 lg:pl-[260px]'
        )}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
