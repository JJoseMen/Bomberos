import { useState } from 'react';
import { toast } from 'sonner';
import { Input, Button, Select, FileUpload } from '@/components/ui';
import { RegistrarPago } from './RegistrarPago';
import { DeclaracionJurada } from './DeclaracionJurada';
import { solicitudesService } from '@/services/solicitudes.service';
import styles from './FormularioCapacitacion.module.scss';

const PASOS = ['Tipo persona', 'Cursos', 'Participantes', 'Pago y declaracion'];

export function FormularioCapacitacion({ codigo = '' }: { codigo?: string }) {
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
        <Select
          label="Tipo de persona"
          options={[
            { value: 'NATURAL', label: 'Natural' },
            { value: 'JURIDICA', label: 'Juridica' },
          ]}
        />
      )}
      {paso === 1 && (
        <Select
          label="Curso"
          options={[
            { value: '1', label: 'Extintores' },
            { value: '2', label: 'Primeros auxilios' },
            { value: '3', label: 'Evacuacion' },
          ]}
        />
      )}
      {paso === 2 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Nombre participante" placeholder="Nombre" />
          <FileUpload
            label="Lista Excel (personas juridicas)"
            accept=".xlsx,.xls"
            onFileSelect={() => undefined}
          />
        </div>
      )}
      {paso === 3 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <RegistrarPago codigo={codigo} monto={20} />
          <DeclaracionJurada codigo={codigo} />
        </div>
      )}
      <div className={styles['nav']}>
        {paso > 0 && (
          <Button variant="ghost" onClick={() => setPaso(paso - 1)}>
            Anterior
          </Button>
        )}
        {paso < 3 && (
          <Button variant="primary" onClick={() => setPaso(paso + 1)}>
            Siguiente
          </Button>
        )}
        {paso === 3 && (
          <Button variant="secondary" onClick={handleEnviar} loading={enviando}>
            Enviar
          </Button>
        )}
      </div>
    </div>
  );
}
