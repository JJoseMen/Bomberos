import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label className={`${styles.wrapper} ${className}`}>
          <input ref={ref} type="checkbox" className={styles.input} {...props} />
          {label && <span className={styles.label}>{label}</span>}
        </label>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
