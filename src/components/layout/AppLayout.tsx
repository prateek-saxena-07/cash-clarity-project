
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Home, BarChart, PieChart, Receipt, DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          active 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        )}
      >
        <span className="h-5 w-5">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  );
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/' },
    { icon: <Receipt className="h-5 w-5" />, label: 'Transactions', path: '/transactions' },
    { icon: <BarChart className="h-5 w-5" />, label: 'Monthly Expenses', path: '/monthly' },
    { icon: <PieChart className="h-5 w-5" />, label: 'Categories', path: '/categories' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Budget', path: '/budget' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col p-4 border-r">
        <div className="flex items-center gap-2 mb-8 px-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Finance Tracker</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={currentPath === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </ul>
        </nav>
        
        <div className="border-t pt-4 mt-auto">
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            path="/settings"
            active={currentPath === '/settings'}
            onClick={() => navigate('/settings')}
          />
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Finance Tracker</h1>
          </div>
        </div>
        
        <div className="flex overflow-x-auto border-t">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center px-4 py-2 min-w-[4rem] text-xs transition-colors",
                currentPath === item.path 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              )}
            >
              <span className="mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:p-6 p-4 pt-28 md:pt-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
