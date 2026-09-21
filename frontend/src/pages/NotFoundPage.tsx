import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import styles from './NotFoundPage.module.scss';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Pagina no encontrada</h2>
      <p className={styles.description}>La pagina que buscas no existe o ha sido movida.</p>
      <Link to="/">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </div>
  );
}
