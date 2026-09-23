import type { ReactNode } from 'react';
import styles from './StatCard.module.scss';

interface StatCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icono: ReactNode;
  colorIcono?: string;
  colorValor?: string;
}

export function StatCard({
  titulo,
  valor,
  subtitulo,
  icono,
  colorIcono = styles.textSecondary,
  colorValor = styles.textOnSurface,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.titulo}>{titulo}</span>
        <span className={`${styles.icono} ${colorIcono}`} aria-hidden="true">
          {icono}
        </span>
      </div>
      <div className={`${styles.valor} ${colorValor}`}>{valor}</div>
      {subtitulo && <div className={styles.subtitulo}>{subtitulo}</div>}
    </div>
  );
}
