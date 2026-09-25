import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button, Badge, Spinner } from '@/components/ui';
import { publicService, type CertificadoValidacion } from '@/services/public.service';
import { formatDate } from '@/lib/format';
import styles from './ValidarCertificadoPage.module.scss';

export function ValidarCertificadoPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CertificadoValidacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    publicService
      .validarCertificado(codigo)
      .then(setData)
      .catch(() =>
        setData({ valido: false, mensaje: 'No se pudo conectar con el servicio de validación' }),
      )
      .finally(() => setLoading(false));
  }, [codigo]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <Spinner size="md" />
          <p className={styles.loadingText}>Validando certificado...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.invalido}`}>
          <XCircle size={48} className={styles.iconRed} />
          <h1 className={styles.title}>Error</h1>
          <p className={styles.message}>No se pudo validar el certificado</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    );
  }

  // ESTADO 4: INVÁLIDO
  if (!data.valido) {
    return (
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.invalido}`}>
          <XCircle size={48} className={styles.iconRed} />
          <h1 className={styles.title}>Certificado No Válido</h1>
          <p className={styles.message}>{data.mensaje}</p>
          <p className={styles.codigo}>Código consultado: {codigo}</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    );
  }

  // ESTADO 3: VENCIDO
  if (data.vencido) {
    return (
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.vencido}`}>
          <AlertTriangle size={48} className={styles.iconOrange} />
          <h1 className={styles.title}>Certificado Vencido</h1>
          <p className={styles.message}>Este certificado existió pero ya venció</p>
          <div className={styles.datos}>
            <div><strong>Código:</strong> {data.codigo}</div>
            <div><strong>Tipo:</strong> {data.tipo}</div>
            <div><strong>Titular:</strong> {data.titular}</div>
            {data.nit && <div><strong>NIT:</strong> {data.nit}</div>}
            {data.fechaEmision && <div><strong>Emisión:</strong> {formatDate(data.fechaEmision)}</div>}
            {data.fechaVigencia && <div><strong>Vigencia:</strong> {formatDate(data.fechaVigencia)}</div>}
            <div><strong>Estado:</strong> <Badge variant="warning" size="sm">VENCIDO</Badge></div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // ESTADO 2: VÁLIDO
  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.valido}`}>
        <CheckCircle size={48} className={styles.iconGreen} />
        <h1 className={styles.title}>Certificado Válido</h1>
        <p className={styles.message}>Este certificado fue emitido por la Dirección Nacional de Bomberos</p>
        <div className={styles.datos}>
          <div><strong>Código:</strong> {data.codigo}</div>
          <div><strong>Tipo:</strong> {data.tipo}</div>
          <div><strong>Titular:</strong> {data.titular}</div>
          {data.nit && <div><strong>NIT:</strong> {data.nit}</div>}
          {data.fechaEmision && <div><strong>Emisión:</strong> {formatDate(data.fechaEmision)}</div>}
          {data.fechaVigencia && <div><strong>Vigencia:</strong> {formatDate(data.fechaVigencia)}</div>}
          <div><strong>Estado:</strong> <Badge variant="success" size="sm">VIGENTE</Badge></div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
