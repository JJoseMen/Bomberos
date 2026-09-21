import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Shield, BookOpen, FileText, Fuel, ArrowRight } from 'lucide-react';
import styles from './HomePage.module.scss';

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  disabled?: boolean;
  subitems?: { label: string; path: string }[];
}

const MODULES: ModuleCard[] = [
  {
    id: 'sippci',
    title: 'SIPPCI',
    description:
      'Sistema de Planificacion y Supervision de la Actividad de los Cuerpos de Bomberos',
    icon: <Shield size={24} />,
    color: '#c62828',
    subitems: [
      { label: 'Registro de Profesionales', path: '/register' },
      { label: 'Capacitacion', path: '/register' },
      { label: 'Cumplimiento al SIPPCI', path: '/register' },
    ],
  },
  {
    id: 'reglamentacion-armeria',
    title: 'Reglamentacion - Armeria',
    description: 'Reglamentacion para infraestructura, campos y poligonos de tiro',
    icon: <BookOpen size={24} />,
    color: '#1a237e',
    subitems: [
      { label: 'Campos de Tiro', path: '/register' },
      { label: 'Poligonos de Tiro', path: '/register' },
    ],
  },
  {
    id: 'reglamentacion-turismo',
    title: 'Reglamentacion - Turismo',
    description: 'Reglamentacion para actividades de turismo',
    icon: <FileText size={24} />,
    color: '#2e7d32',
    subitems: [{ label: 'Certificacion Turistica', path: '/register' }],
  },
  {
    id: 'reglamentacion-hidrocarburos',
    title: 'Reglamentacion - Hidrocarburos',
    description: 'Reglamentacion para hidrocarburos (En aprobacion)',
    icon: <Fuel size={24} />,
    color: '#f57f17',
    disabled: true,
  },
];

export function HomePage() {
  const [selectedModule, setSelectedModule] = useState<ModuleCard | null>(null);

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Al servicio de la comunidad con valor, disciplina y lealtad
        </h1>
        <p className={styles.heroSubtitle}>
          Plataforma tecnologica institucional para la validacion y seguimiento de tramites
          ciudadanos en tiempo real.
        </p>
        <div className={styles.heroActions}>
          <Link to="/login">
            <Button variant="primary" size="lg" leftIcon={<ArrowRight size={18} />}>
              Ingresar como Funcionario
            </Button>
          </Link>
          <Link to="/consulta">
            <Button
              variant="ghost"
              size="lg"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Consultar mi tramite
            </Button>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modulos del Sistema</h2>
        <div className={styles.cardsGrid}>
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className={`${styles.card} ${selectedModule?.id === mod.id ? styles.active : ''} ${mod.disabled ? styles.disabled : ''}`}
              onClick={() => !mod.disabled && setSelectedModule(mod)}
            >
              <div
                className={styles.cardIcon}
                style={{ background: `${mod.color}15`, color: mod.color }}
              >
                {mod.icon}
              </div>
              <h3 className={styles.cardTitle}>{mod.title}</h3>
              <p className={styles.cardDesc}>{mod.description}</p>
            </div>
          ))}
        </div>

        {selectedModule && (
          <div className={styles.detail}>
            <h3 className={styles.detailTitle}>{selectedModule.title}</h3>
            <p style={{ color: '#757575', marginBottom: 16 }}>{selectedModule.description}</p>
            <div className={styles.detailActions}>
              {selectedModule.subitems?.map((item, i) => (
                <Link key={i} to={item.path}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
