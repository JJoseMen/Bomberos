import { Link } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import styles from './NuevaSolicitudPage.module.scss';

const TRAMITES = [
  {
    id: 'profesional',
    title: 'Registro de Profesionales',
    desc: 'Registro y habilitacion profesional',
  },
  { id: 'capacitacion', title: 'Capacitacion', desc: 'Cursos y participantes' },
  { id: 'sippci', title: 'Cumplimiento SIPPCI', desc: 'Certificacion de infraestructura' },
];

export function NuevaSolicitudPage() {
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Nueva Solicitud</h1>
      <p className={styles['subtitle']}>Selecciona el tipo de tramite a iniciar</p>
      <div className={styles['grid']}>
        {TRAMITES.map((t) => (
          <Card key={t.id} title={t.title} subtitle={t.desc}>
            <Link to={`/solicitudes/nueva/${t.id}`}>
              <Button variant="primary" size="sm">
                Iniciar
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
