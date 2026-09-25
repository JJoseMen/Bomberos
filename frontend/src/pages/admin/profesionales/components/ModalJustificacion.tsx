import { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import styles from './ModalJustificacion.module.scss';

interface Props {
  abierto: boolean;
  tipo: 'observar' | 'rechazar';
  codigoSolicitud: string;
  onClose: () => void;
  onConfirmar: (justificacion: string) => Promise<void>;
}

export function ModalJustificacion({ abierto, tipo, codigoSolicitud, onClose, onConfirmar }: Props) {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (abierto) setTexto('');
  }, [abierto]);

  const esValido = texto.trim().length >= 10;
  const titulo = tipo === 'observar' ? 'Observar Solicitud' : 'Rechazar Solicitud';
  const confirmLabel = tipo === 'observar' ? 'Observar' : 'Rechazar';
  const variant = tipo === 'rechazar' ? 'primary' : 'secondary';

  const handleConfirm = async () => {
    if (!esValido) return;
    setLoading(true);
    try {
      await onConfirmar(texto.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={abierto}
      onClose={onClose}
      title={titulo}
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={variant as never} size="sm" onClick={handleConfirm} disabled={!esValido || loading}>
            {loading ? 'Procesando...' : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className={styles.body}>
        <p className={styles.subtitle}>
          Solicitud: <strong>{codigoSolicitud}</strong>
        </p>
        <p className={styles.hint}>
          {tipo === 'observar'
            ? 'La solicitud quedará en estado OBSERVADA y el ciudadano deberá subsanar.'
            : 'La solicitud será RECHAZADA de forma definitiva.'}
        </p>
        <label className={styles.label} htmlFor="justificacion">
          Justificación (mínimo 10 caracteres)
        </label>
        <textarea
          id="justificacion"
          className={styles.textarea}
          rows={4}
          placeholder={tipo === 'observar' ? 'Indique qué debe corregir...' : 'Indique motivo del rechazo...'}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <span className={styles.contador}>{texto.trim().length}/10 mínimo</span>
      </div>
    </Modal>
  );
}
