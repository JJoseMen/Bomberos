import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import styles from './ModalProgramarInspeccion.module.scss';

interface Props {
  abierto: boolean;
  codigoSolicitud: string;
  onClose: () => void;
  onConfirmar: (data: { fechaProgramada: string; observaciones?: string }) => Promise<void>;
}

export function ModalProgramarInspeccion({ abierto, codigoSolicitud, onClose, onConfirmar }: Props) {
  const [fecha, setFecha] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (abierto) {
      setFecha('');
      setObservaciones('');
    }
  }, [abierto]);

  const esValido = fecha.trim().length > 0;

  const handleConfirm = async () => {
    if (!esValido) return;
    setLoading(true);
    try {
      await onConfirmar({
        fechaProgramada: fecha,
        ...(observaciones.trim() ? { observaciones: observaciones.trim() } : {}),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={abierto}
      onClose={onClose}
      title="Programar Inspección Técnica"
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm} disabled={!esValido || loading}>
            {loading ? 'Programando...' : 'Confirmar'}
          </Button>
        </div>
      }
    >
      <div className={styles.body}>
        <p className={styles.subtitle}>
          Solicitud: <strong>{codigoSolicitud}</strong>
        </p>
        <label className={styles.label} htmlFor="fecha-inspeccion">
          Fecha y hora de la inspección *
        </label>
        <Input
          id="fecha-inspeccion"
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <label className={styles.label} htmlFor="obs-inspeccion">
          Observaciones (opcional)
        </label>
        <textarea
          id="obs-inspeccion"
          className={styles.textarea}
          rows={3}
          placeholder="Indique detalles adicionales de la inspección..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>
    </Modal>
  );
}
