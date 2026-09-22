import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input, Select, Button } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import styles from './RegisterPage.module.scss';

const DEPARTAMENTOS = [
  { value: 'LP', label: 'La Paz' },
  { value: 'CB', label: 'Cochabamba' },
  { value: 'SC', label: 'Santa Cruz' },
  { value: 'OR', label: 'Oruro' },
  { value: 'PT', label: 'Potosi' },
  { value: 'CH', label: 'Chuquisaca' },
  { value: 'TJ', label: 'Tarija' },
  { value: 'BE', label: 'Beni' },
  { value: 'PN', label: 'Pando' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { tipoPersona: 'NATURAL' },
  });

  const watchTipo = watch('tipoPersona');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success('Registro exitoso. Verifica tu correo electronico.');
      navigate('/verify-otp', { state: { email: data.email } });
    } catch {
      toast.error('Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Registro Inicial</h1>
      <p className={styles.subtitle}>
        Complete sus datos para solicitar sus credenciales de acceso al sistema.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos Personales</h2>
          <div className={styles.row}>
            <Input label="CI" placeholder="Tu CI" error={errors.ci?.message} {...register('ci')} />
            <Input
              label="Nombre Completo"
              placeholder="Nombre y apellido"
              error={errors.nombreCompleto?.message}
              {...register('nombreCompleto')}
            />
          </div>
          <div className={styles.row}>
            <Select label="Departamento" options={DEPARTAMENTOS} {...register('departamento')} />
          </div>
          <Input label="Telefono" placeholder="Tu telefono" {...register('telefono')} />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Credenciales de Acceso</h2>
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className={styles.row}>
            <Input
              label="Contrasena"
              type="password"
              placeholder="Minimo 8 caracteres"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tramites de Interes</h2>
          <p style={{ fontSize: 14, color: '#757575', marginBottom: 12 }}>
            Representa a una empresa institucional/privada?
          </p>
          <div className={styles.radioGroup}>
            <label
              className={`${styles.radioCard} ${watchTipo === 'NATURAL' ? styles.selected : ''}`}
            >
              <input type="radio" value="NATURAL" {...register('tipoPersona')} />
              <div>
                <div className={styles.radioLabel}>No, actuo de forma independiente</div>
                <div className={styles.radioDesc}>Persona Natural</div>
              </div>
            </label>
            <label
              className={`${styles.radioCard} ${watchTipo === 'JURIDICA' ? styles.selected : ''}`}
            >
              <input type="radio" value="JURIDICA" {...register('tipoPersona')} />
              <div>
                <div className={styles.radioLabel}>Si, represento a una empresa</div>
                <div className={styles.radioDesc}>Persona Juridica</div>
              </div>
            </label>
          </div>
          {watchTipo === 'JURIDICA' && (
            <div className={styles.row} style={{ marginTop: 16 }}>
              <Input label="NIT" placeholder="NIT de la empresa" {...register('nit')} />
            </div>
          )}
        </div>

        <div className={styles.checkbox}>
          <input type="checkbox" required />
          <span>Acepto los terminos y condiciones del sistema</span>
        </div>

        <Button type="submit" fullWidth loading={loading} style={{ marginTop: 16 }}>
          Registrarse
        </Button>
      </form>

      <div className={styles.links}>
        <span>
          Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.link}>
            Iniciar sesion
          </Link>
        </span>
      </div>
    </div>
  );
}
