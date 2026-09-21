import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Radio.module.scss';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`${styles.wrapper} ${className}`}>
        <input ref={ref} type="radio" className={styles.input} {...props} />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
