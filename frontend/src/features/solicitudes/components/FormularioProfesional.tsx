import { useState } from 'react';
import { toast } from 'sonner';
import { Input, Button, Select } from '@/components/ui';
import { SubirDocumento } from './SubirDocumento';
import { RegistrarPago } from './RegistrarPago';
import { DeclaracionJurada } from './DeclaracionJurada';
import { solicitudesService } from '@/services/solicitudes.service';
import styles from './FormularioProfesional.module.scss';

const PASOS = ['Datos personales', 'Datos profesionales', 'Documentos', 'Pago', 'Declaracion'];

export function FormularioProfesional({ codigo = '' }: { codigo?: string }) {
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
          <Input label="Nombre completo" placeholder="Nombre y apellido" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="CI" placeholder="Cedula" />
            <Input label="Telefono" placeholder="Telefono" />
          </div>
        </div>
      )}
      {paso === 1 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Profesion" placeholder="Ej. Ingeniero" />
          <Select
            label="Especialidad"
            options={[
              { value: 'SEG', label: 'Seguridad' },
              { value: 'EMG', label: 'Emergencias' },
            ]}
          />
        </div>
      )}
      {paso === 2 && <SubirDocumento tipoDocumento="CI_ANVERSO" onUpload={() => undefined} />}
      {paso === 3 && <RegistrarPago codigo={codigo} monto={100} />}
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
