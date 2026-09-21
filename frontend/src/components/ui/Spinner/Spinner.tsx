import styles from './Spinner.module.scss';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

export function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  return <span className={`${styles.spinner} ${styles[size]} ${styles[color]}`} />;
}
