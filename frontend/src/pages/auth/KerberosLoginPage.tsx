import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, LogIn, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { kerberosService } from '@/services/kerberos.service';
import styles from './KerberosLoginPage.module.scss';

const CREDENCIALES = [
  { ci: '7711111', nombre: 'Admin Sistema', rol: 'ADMIN', password: '123456' },
  { ci: '9905200', nombre: 'Gestor Cumplimiento', rol: 'GESTOR_CUMPLIMIENTO', password: '123456' },
  { ci: '6622222', nombre: 'Gestor Capacitaciones', rol: 'GESTOR_CAPACITACIONES', password: '123456' },
  { ci: '8812345', nombre: 'Gestor Registro', rol: 'GESTOR_REGISTRO_PROFESIONAL', password: '123456' },
  { ci: '5555555', nombre: 'Cajero Sistema', rol: 'CAJERO', password: '123456' },
];

export function KerberosLoginPage() {
  const navigate = useNavigate();
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ci.trim() || !password.trim()) {
      setError('Complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const { ticket } = await kerberosService.loginKerberos(ci.trim(), password);
      toast.success('Autenticación Kerberos exitosa');
      navigate(`/kerberos/callback?ticket=${ticket}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error en la autenticación';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (user: typeof CREDENCIALES[0]) => {
    setCi(user.ci);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <Shield size={28} className={styles.logoIcon} aria-hidden="true" />
          </div>
          <h1 className={styles.title}>KERBEROS</h1>
          <p className={styles.subtitle}>Autenticación Policía Boliviana</p>
          <p className={styles.subSubtitle}>Sistema Integrado SIPPCI - Bomberos</p>
        </div>

        <div className={styles.divider} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="ci" className={styles.label}>
              CARNET DE IDENTIDAD
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="ci"
                name="ci"
                type="text"
                className={styles.input}
                placeholder="Ej: 7711111"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                disabled={loading}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              CONTRASEÑA
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.btnSpinner} aria-hidden="true" />
            ) : (
              <LogIn size={18} aria-hidden="true" />
            )}
            {loading ? 'AUTENTICANDO...' : 'INGRESAR A KERBEROS'}
          </button>
        </form>

        <div className={styles.dividerRow}>O usa credenciales de prueba</div>

        <button
          type="button"
          className={styles.credentialsToggle}
          onClick={() => setShowCredentials(!showCredentials)}
          aria-expanded={showCredentials}
          aria-controls="credentials-panel"
        >
          {showCredentials ? (
            <>
              <ChevronDown size={18} className={`${styles.chevron} ${styles.chevronOpen}`} aria-hidden="true" />
              Ocultar credenciales
            </>
          ) : (
            <>
              <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
              Mostrar credenciales de prueba
            </>
          )}
        </button>

        <div id="credentials-panel" className={showCredentials ? `${styles.credentialsPanel}` : `${styles.credentialsPanel} hidden`} style={showCredentials ? {} : { display: 'none' }}>
          <table className={styles.credentialsTable} role="grid">
            <thead>
              <tr>
                <th scope="col">CI</th>
                <th scope="col">Nombre</th>
                <th scope="col">Rol</th>
                <th scope="col">Password</th>
              </tr>
            </thead>
            <tbody>
              {CREDENCIALES.map((user) => (
                <tr
                  key={user.ci}
                  onClick={() => fillCredentials(user)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fillCredentials(user); }}
                >
                  <td className={styles.cellCi}>{user.ci}</td>
                  <td>{user.nombre}</td>
                  <td>
                    <span className={styles.cellRol}>{user.rol.replace(/_/g, ' ')}</span>
                  </td>
                  <td className={styles.cellPassword}>{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.simulationBadge} role="status">
          <span className={styles.badgeDot} aria-hidden="true" />
          MODO SIMULACIÓN - Solo Desarrollo
        </div>

        <footer className={styles.footer}>
          Dirección Nacional de Bomberos · Policía Boliviana
        </footer>
      </div>
    </div>
  );
}