import { type ReactNode } from 'react';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <div className={styles.wrapper}>
      {children}
      <span className={`${styles.tooltip} ${styles[position]}`}>{content}</span>
    </div>
  );
}
