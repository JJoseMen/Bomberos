import { type ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className={styles.overlay}>
        <TransitionChild
          enter="enter"
          enterFrom="enterFrom"
          enterTo="enterTo"
          leave="leave"
          leaveFrom="leaveFrom"
          leaveTo="leaveTo"
        >
          <div className={styles.overlay} />
        </TransitionChild>

        <TransitionChild
          enter="enter"
          enterFrom="enterFrom"
          enterTo="enterTo"
          leave="leave"
          leaveFrom="leaveFrom"
          leaveTo="leaveTo"
        >
          <DialogPanel className={`${styles.dialog} ${styles[size]}`}>
            {title && (
              <div className={styles.header}>
                <DialogTitle className={styles.title}>{title}</DialogTitle>
                <button onClick={onClose} className={styles.closeBtn}>
                  <X size={20} />
                </button>
              </div>
            )}
            <div className={styles.body}>{children}</div>
            {footer && <div className={styles.footer}>{footer}</div>}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
