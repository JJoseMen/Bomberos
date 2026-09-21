import { type ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
  padding?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  title,
  subtitle,
  footer,
  children,
  padding = true,
  hoverable = false,
  onClick,
}: CardProps) {
  const classes = [styles.card, hoverable && styles.hoverable, onClick && styles.clickable]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={padding ? styles.body : ''}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
