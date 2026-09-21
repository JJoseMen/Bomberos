import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import styles from './TramitesPage.module.scss';

const TRAMITES = [
  {
    title: 'Registro de Profesionales',
    description:
      'Registro de profesionales habilitados para ejercer actividades en el ambito de bomberos',
    path: '/register',
  },
  {
    title: 'Capacitaciones',
    description:
      'Cursos de capacitacion en extintores, primeros auxilios, evacuacion y trabajos en altura',
    path: '/register',
  },
  {
    title: 'Cumplimiento al SIPPCI',
    description: 'Certificacion de cumplimiento del Sistema de Planificacion y Supervision',
    path: '/register',
  },
];

export function TramitesPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tramites</h1>
      <div className={styles.list}>
        {TRAMITES.map((tramite, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{tramite.title}</h3>
              <p className={styles.cardDesc}>{tramite.description}</p>
            </div>
            <Link to={tramite.path}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Iniciar
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
