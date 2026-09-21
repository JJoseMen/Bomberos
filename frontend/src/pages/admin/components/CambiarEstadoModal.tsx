import { Modal, Select, Input, Button } from '@/components/ui';
import { useState } from 'react';
import styles from './CambiarEstadoModal.module.scss';

export function CambiarEstadoModal({
  isOpen,
  onClose,
  codigo,
  estados,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  codigo: string;
  estados: string[];
  onConfirm: (e: string, o: string) => void;
}) {
  const [est, setEst] = useState('');
  const [obs, setObs] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cambiar estado ${codigo}`}>
      <div className={styles['box']}>
        <Select
          label="Estado"
          value={est}
          onChange={(e) => setEst(e.target.value)}
          options={estados.map((s) => ({ value: s, label: s }))}
        />
        <Input label="Observacion" value={obs} onChange={(e) => setObs(e.target.value)} />
        <Button variant="primary" onClick={() => onConfirm(est, obs)}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
