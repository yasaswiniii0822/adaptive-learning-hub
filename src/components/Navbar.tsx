import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { BookOpen, LayoutDashboard, MessageSquare, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const links = [
    { to: '/', label: t('nav.home'), icon: BookOpen },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/feedback', label: t('nav.feedback'), icon: MessageSquare },
    { to: '/admin', label: t('nav.admin'), icon: ShieldCheck },
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

        <LanguageToggle />
      </div>
    </nav>
  );
};

export default Navbar;
