import { Phone } from 'lucide-react';
import styles from './TopBar.module.scss';

export function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        {/* Izquierda: texto institucional */}
        <span className={styles.leftText}>
          {/* Desktop: texto completo */}
          <span className={styles.fullText}>
            ESTADO PLURINACIONAL DE BOLIVIA · MINISTERIO DE GOBIERNO · POLICÍA BOLIVIANA
          </span>
          {/* Mobile: texto abreviado */}
          <span className={styles.shortText}>ESTADO PLURINACIONAL DE BOLIVIA</span>
        </span>

        {/* Derecha: línea de emergencias */}
        <span className={styles.rightText}>
          <Phone size={14} className={styles.icon} aria-hidden="true" />
          <span className={styles.emergencyLabel}>Línea de Emergencias:</span>
          <span className={styles.emergencyNumber}>119</span>
        </span>
      </div>
    </div>
  );
}
