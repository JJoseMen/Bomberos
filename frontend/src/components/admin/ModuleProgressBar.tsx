import styles from './ModuleProgressBar.module.scss';

interface ModuleProgressBarProps {
  nombre: string;
  tramites: number;
  porcentaje: number;
  color?: string;
}

export function ModuleProgressBar({
  nombre,
  tramites,
  porcentaje,
  color = '#0f1f3c',
}: ModuleProgressBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.left}>
          <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden="true" />
          <span className={styles.nombre}>{nombre}</span>
        </div>
        <div className={styles.right}>
          <span className={styles.tramites}>{tramites} trámites</span>
          <span className={styles.porcentaje}>{porcentaje}%</span>
        </div>
      </div>
      <div className={styles.barra} role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100} aria-label={nombre}>
        <div className={styles.relleno} style={{ width: `${porcentaje}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
