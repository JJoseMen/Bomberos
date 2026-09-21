import { useState } from 'react';
import { toast } from 'sonner';
import { Input, Button } from '@/components/ui';
import { SubirDocumento } from './SubirDocumento';
import { RegistrarPago } from './RegistrarPago';
import { DeclaracionJurada } from './DeclaracionJurada';
import { solicitudesService } from '@/services/solicitudes.service';
import styles from './FormularioSIPPCI.module.scss';

const PASOS = ['Titular', 'Infraestructura', 'Documentos', 'Pago', 'Declaracion'];

export function FormularioSIPPCI({ codigo = '' }: { codigo?: string }) {
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    console.log('enviar solicitud', codigo);
    if (!codigo) {
      toast.error('Crea primero la solicitud en borrador');
      return;
    }
    setEnviando(true);
    try {
      const res = await solicitudesService.enviar(codigo);
      console.log('enviada', res);
      toast.success(`Enviada: ${res.codigoFormulario}`);
    } catch (e) {
      console.log('error enviar', e);
      toast.error('No se pudo enviar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles['wrap']}>
      <div className={styles['steps']}>
        {PASOS.map((p, i) => (
          <span key={p} className={`${styles['step']} ${i === paso ? styles['active'] : ''}`}>
            {i + 1}. {p}
          </span>
        ))}
      </div>
      {paso === 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Razon social / Nombre" placeholder="Titular" />
          <Input label="NIT / CI" placeholder="Documento" />
        </div>
      )}
      {paso === 1 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Direccion infraestructura" placeholder="Direccion" />
          <Input label="Superficie (m2)" placeholder="Ej. 250" />
        </div>
      )}
      {paso === 2 && <SubirDocumento tipoDocumento="PLANO" onUpload={() => undefined} />}
      {paso === 3 && <RegistrarPago codigo={codigo} monto={150} />}
      {paso === 4 && <DeclaracionJurada codigo={codigo} />}
      <div className={styles['nav']}>
        {paso > 0 && (
          <Button variant="ghost" onClick={() => setPaso(paso - 1)}>
            Anterior
          </Button>
        )}
        {paso < 4 && (
          <Button variant="primary" onClick={() => setPaso(paso + 1)}>
            Siguiente
          </Button>
        )}
        {paso === 4 && (
          <Button variant="secondary" onClick={handleEnviar} loading={enviando}>
            Enviar
          </Button>
        )}
      </div>
    </div>
  );
}
