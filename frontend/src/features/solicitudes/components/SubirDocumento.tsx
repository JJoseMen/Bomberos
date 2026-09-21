import { FileUpload, Badge } from '@/components/ui';
import styles from './SubirDocumento.module.scss';

export function SubirDocumento({
  tipoDocumento,
  onUpload,
}: {
  tipoDocumento: string;
  onUpload: (f: File) => void;
}) {
  return (
    <div className={styles['box']}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{tipoDocumento}</strong>
        <Badge variant="warning" size="sm">
          PENDIENTE
        </Badge>
      </div>
      <FileUpload label="Documento" accept=".pdf,.jpg,.png" onFileSelect={onUpload} />
    </div>
  );
}
