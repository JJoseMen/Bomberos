import { useParams } from 'react-router-dom';
import { Badge, Button } from '@/components/ui';
import styles from './RevisionDocumentosPage.module.scss';

const DOCS = [
  { tipo: 'CI_ANVERSO', estado: 'PENDIENTE' },
  { tipo: 'PLANO', estado: 'PENDIENTE' },
];

export function RevisionDocumentosPage() {
  const { codigo } = useParams<{ codigo: string }>();
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Revision: {codigo}</h1>
      {DOCS.map((d) => (
        <div key={d.tipo} className={styles['doc']}>
          <div>
            <strong>{d.tipo}</strong>
            <br />
            <Badge variant="warning" size="sm">
              {d.estado}
            </Badge>
          </div>
          <div className={styles['row']}>
            <Button variant="primary" size="sm">
              Aprobar
            </Button>
            <Button variant="ghost" size="sm">
              Rechazar
            </Button>
          </div>
        </div>
      ))}
      <Button variant="secondary">Dar visto bueno (REVISADO)</Button>
    </div>
  );
}
