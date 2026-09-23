import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui';
import { TopBar } from '../TopBar/TopBar';
import styles from './Header.module.scss';

interface HeaderProps {
  showTopBar?: boolean;
}

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Tramites', path: '/tramites' },
  { label: 'Consulta', path: '/consulta' },
  { label: 'Contactos', path: '/contactos' },
];

export function Header({ showTopBar = true }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={styles.header}>
      {showTopBar && <TopBar />}
      <div className={styles.mainBar}>
        <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>DNB</div>
          <span className={styles.logoText}>SIPPCI</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<LogIn size={16} />}
              className={styles.loginBtn}
            >
              Ingreso
            </Button>
          </Link>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className={styles.mobileNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.mobileNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
