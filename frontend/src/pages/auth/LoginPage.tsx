import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input, Button } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      if (res._devOtp) {
        toast.info(`OTP dev: ${res._devOtp}`);
      }
      if (res.access_token && res.user) {
        setAuth(res.access_token, res.user);
        toast.success('Sesion iniciada correctamente');
        navigate('/dashboard');
      } else {
        navigate('/verify-otp', { state: { email: data.email } });
      }
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Iniciar Sesion</h1>
      <p className={styles.subtitle}>Ingresa tus credenciales para acceder al sistema</p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Contrasena"
          type="password"
          placeholder="Tu contrasena"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth loading={loading}>
          Iniciar sesion
        </Button>
      </form>

      <div className={styles.links}>
        <span>
          No tienes cuenta?{' '}
          <Link to="/register" className={styles.link}>
            Registrate
          </Link>
        </span>
      </div>
    </div>
  );
}
