import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import styles from './KerberosCallbackPage.module.scss';

export function KerberosCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ticket = params.get('ticket');

    if (!ticket) {
      setError(true);
      return;
    }

    authService
      .kerberosExchange(ticket)
      .then((res) => {
        if (res.access_token && res.user) {
          setAuth(res.access_token, res.user);
          toast.success('Autenticacion exitosa');
          const rol = (res.user as { rol?: string; tipo?: string }).rol ?? (res.user as { tipo?: string }).tipo;

          const ROLE_ROUTES: Record<string, string> = {
            ADMIN: '/admin/dashboard',
            GESTOR_CUMPLIMIENTO: '/admin/dashboard',
            GESTOR_CAPACITACIONES: '/admin/dashboard',
            GESTOR_REGISTRO_PROFESIONAL: '/admin/dashboard',
            CAJERO: '/admin/dashboard',
          };

          const targetRoute = rol && ROLE_ROUTES[rol] ? ROLE_ROUTES[rol] : '/dashboard';
          navigate(targetRoute);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
        toast.error('Error en la autenticacion Kerberos');
      });
  }, [location.search, setAuth, navigate]);

  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Error de autenticacion</h1>
        <p className={styles.subtitle}>No se pudo validar el ticket Kerberos</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.spinner} />
      <h1 className={styles.title}>Autenticando...</h1>
      <p className={styles.subtitle}>Validando credenciales Kerberos</p>
    </div>
  );
}
