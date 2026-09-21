import { useState } from 'react';
import { toast } from 'sonner';
import { Input, Button, Checkbox } from '@/components/ui';
import { declaracionesService } from '@/services/declaraciones.service';
import styles from './DeclaracionJurada.module.scss';

export function DeclaracionJurada({ codigo }: { codigo: string }) {
  const [acepta, setAcepta] = useState(false);
  const [firmadoPor, setFirmadoPor] = useState('');
  const [ciFirmante, setCiFirmante] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFirmar = async () => {
    console.log('firmar declaracion', { codigo, firmadoPor, ciFirmante });
    if (!firmadoPor.trim() || !ciFirmante.trim()) {
      toast.error('Ingresa nombre y CI del firmante');
      return;
    }
    setLoading(true);
    try {
      await declaracionesService.firmar(codigo, { firmadoPor, ciFirmante });
      toast.success('Declaracion firmada');
    } catch (e) {
      console.log('error firmar', e);
      toast.error('No se pudo firmar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['box']}>
      <div className={styles['texto']}>
        Declaro bajo juramento que los datos consignados son verdaderos y asumo responsabilidad
        legal conforme a normativa vigente.
      </div>
      <Input
        label="Nombre del firmante"
        placeholder="Nombre completo"
        value={firmadoPor}
        onChange={(e) => setFirmadoPor(e.target.value)}
      />
      <Input
        label="CI del firmante"
        placeholder="Cedula"
        value={ciFirmante}
        onChange={(e) => setCiFirmante(e.target.value)}
      />
      <Checkbox
        label="Acepto los terminos de la declaracion jurada"
        checked={acepta}
        onChange={(e) => setAcepta(e.target.checked)}
      />
      <Button variant="primary" disabled={!acepta || loading} onClick={handleFirmar}>
        Firmar declaracion
      </Button>
    </div>
  );
}
