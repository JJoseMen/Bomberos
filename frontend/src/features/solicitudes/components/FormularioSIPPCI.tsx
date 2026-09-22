import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input, Select, Button, FileUpload } from '@/components/ui';
import { useAuthStore } from '@/stores/auth.store';
import { solicitudesService } from '@/services/solicitudes.service';
import { tramiteService, type TipoDocumentoBackend } from '@/services/tramite.service';
import { EXPEDIDOS, BANCOS, NIVELES_RIESGO, TIPOS_INFRAESTRUCTURA } from './wizardOptions';
import { descargarBlob } from '@/lib/download';
import styles from './FormularioSIPPCI.module.scss';

const schema = z.object({
  nombreCompleto: z.string().min(2, 'Minimo 2 caracteres'),
  ci: z.string().min(4, 'Ingresa tu CI'),
  expedido: z.string().min(1, 'Selecciona expedido'),
  email: z.string().email('Email invalido'),
  telefono: z.string().optional(),
  tipoInfraestructura: z.string().min(1, 'Selecciona tipo'),
  nivelRiesgo: z.string().min(1, 'Selecciona nivel'),
  superficie: z.coerce.number().positive('Superficie valida'),
  aforoMaximo: z.coerce.number().positive('Aforo valido'),
  numeroPisos: z.coerce.number().nonnegative(),
  actividadPrincipal: z.string().min(2, 'Describe la actividad'),
  planoDiseno: z.string().min(1, 'Adjunta el plano'),
  planEmergencia: z.string().min(1, 'Adjunta el plan'),
  cedulaIdentidad: z.string().min(1, 'Adjunta el carnet'),
  numeroOperacion: z.string().min(1, 'Requerido'),
  monto: z.coerce.number().positive('Monto valido'),
  fechaDeposito: z.string().min(1, 'Requerido'),
  banco: z.string().min(1, 'Selecciona banco'),
  comprobante: z.string().min(1, 'Adjunta comprobante'),
});

type FormData = z.infer<typeof schema>;
const PASOS = ['Titular', 'Infraestructura', 'Documentos', 'Pago', 'Declaracion'];
const STORAGE_KEY = 'sippci_wizard_sippci';
const STEP_FIELDS: (keyof FormData)[][] = [
  ['nombreCompleto', 'ci', 'expedido', 'email', 'telefono'],
  [
    'tipoInfraestructura',
    'nivelRiesgo',
    'superficie',
    'aforoMaximo',
    'numeroPisos',
    'actividadPrincipal',
  ],
  ['planoDiseno', 'planEmergencia', 'cedulaIdentidad'],
  ['numeroOperacion', 'monto', 'fechaDeposito', 'banco', 'comprobante'],
  [],
];
const ARCHIVOS: { campo: keyof FormData; tipo: TipoDocumentoBackend; requerido: boolean }[] = [
  { campo: 'planoDiseno', tipo: 'PLANO_SIPPCI', requerido: true },
  { campo: 'planEmergencia', tipo: 'PLAN_EMERGENCIA', requerido: true },
  { campo: 'cedulaIdentidad', tipo: 'CI', requerido: true },
  { campo: 'comprobante', tipo: 'BOLETA_DEPOSITO', requerido: true },
];

export function FormularioSIPPCI() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [paso, setPaso] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const [archivos, setArchivos] = useState<Record<string, File | null>>({});
  const [codigoSol, setCodigoSol] = useState<string>('');
  const [dj, setDj] = useState<{ codigoDeclaracion: string } | null>(null);
  const [pdfFirmado, setPdfFirmado] = useState<File | null>(null);
  const [firmada, setFirmada] = useState(false);
  const nombreCompleto = user ? `${user.nombre} ${user.apellido}`.trim() : '';
  const defaultData = { nombreCompleto, email: user?.email || '' };

  const {
    register,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultData, monto: 150, telefono: '' },
  });

  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        reset({ ...JSON.parse(guardado), ...defaultData });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const sub = watch((val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)));
    return () => sub.unsubscribe();
  }, [watch]);

  const setFile = (name: keyof FormData) => (file: File) => {
    setValue(name as 'ci', file.name as never);
    setArchivos((prev) => ({ ...prev, [name as string]: file }));
  };

  const guardarSolicitud = async (data: FormData) => {
    const sol = await solicitudesService.create({
      tipoTramite: 'CERTIFICACION_SIPPCI',
      subtipoTramite: user?.tipoPersona === 'JURIDICA' ? 'JURIDICA' : 'INFRAESTRUCTURA',
      datosJson: { ...data, tipoPersona: user?.tipoPersona || 'NATURAL' },
    });
    setCodigoSol(sol.codigoFormulario);
    for (const { campo, tipo, requerido } of ARCHIVOS) {
      const file = archivos[campo as string];
      if (!file) {
        if (requerido) throw new Error(`Falta archivo requerido: ${String(campo)}`);
        continue;
      }
      await tramiteService.subirDocumento(sol.codigoFormulario, tipo, file);
    }
    await tramiteService.registrarPago(sol.codigoFormulario, {
      numeroOperacion: data.numeroOperacion,
      monto: data.monto,
      fechaDeposito: data.fechaDeposito,
      banco: data.banco,
    });
    return sol.codigoFormulario;
  };

  const avanzar = async () => {
    const ok = await trigger(STEP_FIELDS[paso]);
    if (!ok) return;
    if (paso === 3) {
      setOcupado(true);
      const data = watch();
      try {
        await guardarSolicitud(data as unknown as FormData);
        setPaso(4);
      } catch (e) {
        console.log('error al guardar borrador', e);
        toast.error('No se pudo guardar la solicitud');
      } finally {
        setOcupado(false);
      }
      return;
    }
    setPaso(paso + 1);
  };

  const generarDj = async () => {
    if (!codigoSol) return;
    setOcupado(true);
    try {
      const r = await tramiteService.generarDeclaracion(codigoSol);
      setDj({ codigoDeclaracion: r.codigoDeclaracion });
      toast.success(`Declaracion ${r.codigoDeclaracion} generada`);
    } catch (e) {
      console.log('error generar dj', e);
      toast.error('No se pudo generar la declaracion jurada');
    } finally {
      setOcupado(false);
    }
  };

  const descargarPdf = async () => {
    if (!codigoSol) return;
    const blob = await tramiteService.descargarDeclaracionPdf(codigoSol);
    descargarBlob(blob, `${dj?.codigoDeclaracion ?? 'declaracion'}.pdf`);
  };

  const subirFirmada = async (file: File) => {
    if (!codigoSol) return;
    setOcupado(true);
    try {
      await tramiteService.subirDeclaracionFirmada(codigoSol, file);
      setPdfFirmado(file);
      setFirmada(true);
      toast.success('PDF firmado subido correctamente');
    } catch (e) {
      console.log('error subir firmada', e);
      toast.error('No se pudo subir el PDF firmado');
    } finally {
      setOcupado(false);
    }
  };

  const enviarSolicitud = async () => {
    if (!codigoSol || !firmada) return;
    setOcupado(true);
    try {
      const enviada = await solicitudesService.enviar(codigoSol);
      toast.success(`Solicitud ${enviada.codigoFormulario} enviada`);
      localStorage.removeItem(STORAGE_KEY);
      navigate('/mis-solicitudes');
    } catch (e) {
      console.log('error enviar', e);
      toast.error('No se pudo enviar la solicitud');
    } finally {
      setOcupado(false);
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
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 14 }}>
        {paso === 0 && (
          <>
            <Input
              label="Nombre completo"
              error={errors.nombreCompleto?.message}
              {...register('nombreCompleto')}
            />
            <Input label="CI" error={errors.ci?.message} {...register('ci')} />
            <Select
              label="Expedido"
              options={EXPEDIDOS}
              error={errors.expedido?.message}
              {...register('expedido')}
            />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input label="Telefono" error={errors.telefono?.message} {...register('telefono')} />
          </>
        )}
        {paso === 1 && (
          <>
            <Select
              label="Tipo de infraestructura"
              options={TIPOS_INFRAESTRUCTURA}
              error={errors.tipoInfraestructura?.message}
              {...register('tipoInfraestructura')}
            />
            <Select
              label="Nivel de riesgo"
              options={NIVELES_RIESGO}
              error={errors.nivelRiesgo?.message}
              {...register('nivelRiesgo')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Superficie (m2)"
                type="number"
                error={errors.superficie?.message}
                {...register('superficie')}
              />
              <Input
                label="Aforo maximo"
                type="number"
                error={errors.aforoMaximo?.message}
                {...register('aforoMaximo')}
              />
            </div>
            <Input
              label="Numero de pisos"
              type="number"
              error={errors.numeroPisos?.message}
              {...register('numeroPisos')}
            />
            <Input
              label="Actividad principal"
              error={errors.actividadPrincipal?.message}
              {...register('actividadPrincipal')}
            />
          </>
        )}
        {paso === 2 && (
          <>
            <FileUpload
              label="Plano de diseno"
              accept=".pdf"
              onFileSelect={setFile('planoDiseno')}
            />
            {errors.planoDiseno && (
              <span className={styles['error']}>{errors.planoDiseno.message}</span>
            )}
            <FileUpload
              label="Plan de emergencia"
              accept=".pdf"
              onFileSelect={setFile('planEmergencia')}
            />
            {errors.planEmergencia && (
              <span className={styles['error']}>{errors.planEmergencia.message}</span>
            )}
            <FileUpload
              label="Cedula de identidad"
              accept=".pdf"
              onFileSelect={setFile('cedulaIdentidad')}
            />
            {errors.cedulaIdentidad && (
              <span className={styles['error']}>{errors.cedulaIdentidad.message}</span>
            )}
          </>
        )}
        {paso === 3 && (
          <>
            <Input
              label="Numero de operacion"
              error={errors.numeroOperacion?.message}
              {...register('numeroOperacion')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Monto (Bs)"
                type="number"
                error={errors.monto?.message}
                {...register('monto')}
              />
              <Input
                label="Fecha deposito"
                type="date"
                error={errors.fechaDeposito?.message}
                {...register('fechaDeposito')}
              />
            </div>
            <Select
              label="Banco"
              options={BANCOS}
              error={errors.banco?.message}
              {...register('banco')}
            />
            <FileUpload
              label="Comprobante"
              accept=".pdf,.jpg,.png"
              onFileSelect={setFile('comprobante')}
            />
            {errors.comprobante && (
              <span className={styles['error']}>{errors.comprobante.message}</span>
            )}
          </>
        )}
        {paso === 4 && (
          <>
            <p style={{ fontSize: 13, color: '#555' }}>
              Genera la Declaracion Jurada, imprimela, firmala en papel y escaneala para subirla
              como descargo legal.
            </p>
            {!dj ? (
              <Button type="button" variant="primary" loading={ocupado} onClick={generarDj}>
                Generar Declaracion Jurada
              </Button>
            ) : (
              <>
                <p>
                  Codigo: <strong>{dj.codigoDeclaracion}</strong>
                </p>
                <Button type="button" variant="secondary" onClick={descargarPdf}>
                  Descargar PDF
                </Button>
                <p style={{ fontSize: 13, color: '#757575' }}>
                  Imprima, firme y escanee el PDF, luego suba el archivo firmado.
                </p>
                <FileUpload
                  label="Subir PDF firmado"
                  accept=".pdf"
                  disabled={firmada}
                  onFileSelect={subirFirmada}
                />
                {pdfFirmado && (
                  <p style={{ fontSize: 13, color: '#2e7d32' }}>Subido: {pdfFirmado.name}</p>
                )}
                <Button
                  type="button"
                  variant="primary"
                  loading={ocupado}
                  disabled={!firmada}
                  onClick={enviarSolicitud}
                >
                  Enviar Solicitud
                </Button>
              </>
            )}
          </>
        )}
        <div className={styles['nav']}>
          {paso > 0 && (
            <Button
              type="button"
              variant="ghost"
              disabled={ocupado}
              onClick={() => setPaso(paso - 1)}
            >
              Anterior
            </Button>
          )}
          {paso < 4 && (
            <Button
              type="button"
              variant="primary"
              loading={paso === 3 && ocupado}
              onClick={avanzar}
            >
              Siguiente
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
