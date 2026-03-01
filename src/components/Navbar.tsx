import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, MessageSquare, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const links = [
    { to: '/', label: 'Home', icon: BookOpen },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold">VidyaPath</span>
        </Link>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="ml-2">
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="ml-2">
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
