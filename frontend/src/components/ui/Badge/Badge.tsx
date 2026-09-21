import { type ReactNode } from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Badge({ variant = 'neutral', size = 'md', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>{children}</span>;
}
