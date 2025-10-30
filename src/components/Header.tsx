import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="h-14 md:h-16 border-b bg-card flex items-center justify-between px-3 md:px-6">
      <SidebarTrigger />
      
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleTheme}
        className="ml-auto h-9 w-9 md:h-10 md:w-10"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4 md:h-5 md:w-5" />
        ) : (
          <Sun className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </Button>
    </header>
  );
}
