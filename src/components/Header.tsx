import { Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="h-14 md:h-16 border-b bg-card flex items-center justify-between px-3 md:px-6">
      <SidebarTrigger />
      
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          className="h-9 w-9 md:h-10 md:w-10"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <Sun className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={signOut}
          className="h-9 w-9 md:h-10 md:w-10"
          title="Logout"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </header>
  );
}
