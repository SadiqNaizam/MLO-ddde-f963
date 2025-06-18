import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users, // Using Users for 'Accounts' as a generic people/group icon
  ArrowRightLeft,
  ReceiptText,
  CreditCard as CreditCardIcon, // Renamed to avoid conflict with potential logo component
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/accounts-management', icon: Users, label: 'Accounts' },
  { to: '/transfers-and-payments', icon: ArrowRightLeft, label: 'Transfers' },
  { to: '/transfers-and-payments', icon: ReceiptText, label: 'Bill Pay' }, // Mapping Bill Pay to Transfers
  { to: '/card-management', icon: CreditCardIcon, label: 'Cards' },
  { to: '/user-settings', icon: Settings, label: 'Settings' },
];

const CollapsibleSidebar: React.FC = () => {
  console.log('CollapsibleSidebar loaded');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navLinkClasses = (isActive: boolean, isCollapsed: boolean) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
      isActive && 'bg-muted text-primary font-semibold',
      isCollapsed ? 'justify-center' : ''
    );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'sticky top-0 h-screen border-r bg-background transition-all duration-300 ease-in-out flex flex-col',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center border-b px-4 lg:px-6 justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <CreditCardIcon className="h-6 w-6 text-primary" />
              <span>FinDash</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(isCollapsed && "mx-auto")}>
            {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            <span className="sr-only">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
          </Button>
        </div>
        <nav className={cn('flex-1 overflow-auto py-4 px-2', isCollapsed ? 'space-y-1' : 'space-y-1')}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => navLinkClasses(isActive, isCollapsed)}
            >
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <item.icon className="h-5 w-5" />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Optional: Add a footer section to the sidebar if needed */}
        {/* <div className="mt-auto p-4 border-t"> ... </div> */}
      </aside>
    </TooltipProvider>
  );
};

export default CollapsibleSidebar;