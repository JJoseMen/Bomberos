import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumbs.module.scss';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLast ? (
              <span className={styles.current}>{item.label}</span>
            ) : (
              <Link to={item.path || '#'} className={styles.item}>
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className={styles.separator} />}
          </span>
        );
      })}
    </nav>
  );
}
