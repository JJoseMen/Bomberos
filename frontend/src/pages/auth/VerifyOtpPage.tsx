import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input, Button } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { otpSchema, type OtpFormData } from '@/lib/validators';
import styles from './VerifyOtpPage.module.scss';

export function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const email = (location.state as { email?: string })?.email || '';
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email },
  });

  const onSubmit = async (data: OtpFormData) => {
    console.log('verifyOtp llamado', data);
    setLoading(true);
    try {
      const res = await authService.verifyOtp(data);
      console.log('respuesta', res);
      if (!res.access_token) {
        toast.error('Respuesta incompleta del servidor');
        return;
      }
      setToken(res.access_token);
      if (res.user) setUser(res.user);
      toast.success('Verificacion exitosa');
      const rol = String(
        (res.user as { tipo?: string; rol?: string; role?: string } | undefined)?.tipo ??
          (res.user as { rol?: string } | undefined)?.rol ??
          '',
      ).toUpperCase();
      if (rol === 'ADMIN') navigate('/admin/dashboard');
      else if (rol === 'OFICIAL') navigate('/oficial/dashboard');
      else if (rol === 'CAJERO') navigate('/cajero/dashboard');
      else navigate('/dashboard');
    } catch (e) {
      console.log('error', e);
      toast.error('Codigo invalido o expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(email);
      toast.success('Codigo reenviado');
    } catch {
      toast.error('Error al reenviar codigo');
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Verificacion de Codigo</h1>
      <p className={styles.subtitle}>
        Ingresa el codigo de 6 digitos enviado a <strong>{email}</strong>
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Codigo OTP"
          placeholder="000000"
          error={errors.codigo?.message}
          className={styles.codeInput}
          maxLength={6}
          {...register('codigo')}
        />
        <Button type="submit" fullWidth loading={loading}>
          Verificar
        </Button>
      </form>

      <div className={styles.links}>
        <span className={styles.link} onClick={handleResend}>
          Reenviar codigo
        </span>
      </div>
    </div>
  );
}
