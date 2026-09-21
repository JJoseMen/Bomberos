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
          const rol = (res.user as { tipo?: string }).tipo;
          if (rol === 'ADMIN') navigate('/admin/dashboard');
          else if (rol === 'OFICIAL') navigate('/oficial/dashboard');
          else if (rol === 'CAJERO') navigate('/cajero/dashboard');
          else navigate('/dashboard');
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
