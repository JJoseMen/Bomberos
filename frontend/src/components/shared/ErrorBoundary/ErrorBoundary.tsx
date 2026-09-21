import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import styles from './ErrorBoundary.module.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper}>
          <AlertTriangle size={48} className={styles.icon} />
          <h2 className={styles.title}>Algo salio mal</h2>
          <p className={styles.description}>
            Ha ocurrido un error inesperado. Por favor, intente de nuevo.
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Recargar pagina
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
