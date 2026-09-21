import { useState } from 'react';
import { toast } from 'sonner';
import { Input, Button } from '@/components/ui';
import { certificadosService } from '@/services/certificados.service';
import styles from './EmisionCertificadosPage.module.scss';

export function EmisionCertificadosPage() {
  const [codigo, setCodigo] = useState('');
  const [codigoCert, setCodigoCert] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistrar = async () => {
    console.log('registrar certificado', { codigo, codigoCert });
    if (!codigo.trim() || !codigoCert.trim()) {
      toast.error('Ingresa solicitud y codigo fisico');
      return;
    }
    setLoading(true);
    try {
      await certificadosService.registrar(codigo.trim(), { codigoCertificado: codigoCert.trim() });
      toast.success('Certificado registrado');
      setCodigoCert('');
    } catch (e) {
      console.log('error registrar', e);
      toast.error('No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Emision de Certificados</h1>
      <div className={styles['card']}>
        <p>Solicitudes APROBADAS pendientes de certificado fisico</p>
        <Input
          label="Codigo de solicitud"
          placeholder="SIPPCI-..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Input
          label="Codigo certificado fisico"
          placeholder="CERT-..."
          value={codigoCert}
          onChange={(e) => setCodigoCert(e.target.value)}
        />
        <div style={{ marginTop: 12 }}>
          <Button variant="primary" size="sm" onClick={handleRegistrar} loading={loading}>
            Registrar certificado
          </Button>
        </div>
      </div>
    </div>
  );
}
