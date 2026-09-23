import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Shield, Plane, Fuel, ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/ui';
import { Modal } from '@/components/ui/Modal/Modal';
import styles from './ModulosOperativos.module.scss';

type ModuloId = 'sippci' | 'armeria' | 'turismo' | 'hidrocarburos';

interface ModuloDef {
  id: ModuloId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const MODULOS: ModuloDef[] = [
  {
    id: 'sippci',
    title: 'SIPPCI',
    subtitle: 'Infraestructura',
    icon: <Landmark size={22} />,
  },
  {
    id: 'armeria',
    title: 'REGLAMENTACIÓN',
    subtitle: 'Armería, Campos y Polígonos',
    icon: <Shield size={22} />,
  },
  {
    id: 'turismo',
    title: 'REGLAMENTACIÓN',
    subtitle: 'Turismo',
    icon: <Plane size={22} />,
  },
  {
    id: 'hidrocarburos',
    title: 'REGLAMENTACIÓN',
    subtitle: 'Hidrocarburos',
    icon: <Fuel size={22} />,
  },
];

interface Detalle {
  title: string;
  description: string;
  botones: { label: string; to: string }[];
}

const DETALLES: Record<Exclude<ModuloId, 'hidrocarburos'>, Detalle> = {
  sippci: {
    title: 'SIPPCI · Inspección de Infraestructuras',
    description:
      'Gestión y revisión técnica de planes de evacuación, sistemas fijos contra incendios, señalización reglamentaria y extintores para todo tipo de edificaciones comerciales, industriales y multifamiliares.',
    botones: [
      { label: 'Registro de Profesionales', to: '/tramites' },
      { label: 'Capacitación', to: '/tramites' },
      { label: 'Cumplimiento SIPPCI', to: '/tramites' },
    ],
  },
  armeria: {
    title: 'REGLAMENTACIÓN · Armerías, Campos y Polígonos de Tiro',
    description:
      'Certificación especializada en medidas de seguridad pasiva y activa para instalaciones de almacenamiento de armamento, así como la delimitación técnica y protección perimetral en campos de entrenamiento y polígonos.',
    botones: [
      { label: 'Armería', to: '/tramites' },
      { label: 'Campos de Tiro', to: '/tramites' },
      { label: 'Polígonos de Tiro', to: '/tramites' },
    ],
  },
  turismo: {
    title: 'REGLAMENTACIÓN · Sector Turismo y Hotelería',
    description:
      'Planes de contingencia y normativas de protección contra incendios adaptadas a establecimientos hoteleros, hospedajes y centros de gran afluencia de visitantes para resguardar la seguridad del turismo nacional e internacional.',
    botones: [
      { label: 'Actividades Aéreas', to: '/tramites' },
      { label: 'Actividades Acuáticas', to: '/tramites' },
      { label: 'Actividades Terrestres', to: '/tramites' },
    ],
  },
};

export function ModulosOperativos() {
  const [activo, setActivo] = useState<ModuloId | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = (id: ModuloId) => {
    if (id === 'hidrocarburos') {
      setModalOpen(true);
      return;
    }
    setActivo((prev) => (prev === id ? null : id));
  };

  const detalle = activo && activo !== 'hidrocarburos' ? DETALLES[activo] : null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Arquitectura Funcional</span>
          <h2 className={styles.title}>Módulos Operativos del Sistema</h2>
          <p className={styles.subtitle}>
            Estructura unificada de supervisión conforme a las directrices sectoriales de la Policía
            Boliviana y la Ley N° 449.
          </p>
        </div>

        <div className={styles.grid}>
          {MODULOS.map((m) => {
            const isActive = activo === m.id;
            return (
              <button
                key={m.id}
                type="button"
                className={`${styles.card} ${isActive ? styles.active : ''}`}
                onClick={() => handleClick(m.id)}
              >
                <span className={styles.cardIcon}>{m.icon}</span>
                <span className={styles.cardText}>
                  <span className={styles.cardTitle}>{m.title}</span>
                  <span className={styles.cardSubtitle}>{m.subtitle}</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`${styles.chevron} ${isActive ? styles.chevronOpen : ''}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {detalle && (
          <div className={styles.detalle}>
            <h3 className={styles.detalleTitle}>{detalle.title}</h3>
            <p className={styles.detalleDesc}>{detalle.description}</p>
            <div className={styles.detalleActions}>
              {detalle.botones.map((b) => (
                <Link key={b.label} to={b.to}>
                  <Button variant="primary" size="sm">
                    {b.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Módulo en Desarrollo"
        footer={
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Entendido
          </Button>
        }
      >
        <div className={styles.modalContent}>
          <span className={styles.modalIcon}>
            <Info size={24} aria-hidden="true" />
          </span>
          <p className={styles.modalText}>
            El sistema de control SIPPCI para el sector de Hidrocarburos se encuentra actualmente en
            proceso de aprobación de reglamento.
          </p>
        </div>
      </Modal>
    </section>
  );
}
