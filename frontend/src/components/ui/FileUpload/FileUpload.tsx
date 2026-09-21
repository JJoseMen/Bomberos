import { useRef, useState, type DragEvent } from 'react';
import { Upload, X } from 'lucide-react';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FileUpload({
  label,
  accept,
  maxSize = 10 * 1024 * 1024,
  onFileSelect,
  error,
  disabled = false,
  required,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      alert(`El archivo excede el tamaño maximo de ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {selectedFile ? (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{selectedFile.name}</span>
          <button type="button" onClick={handleRemove} className={styles.removeBtn}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${error ? styles.hasError : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={24} className={styles.icon} />
          <span className={styles.text}>Arrastra o haz clic para seleccionar</span>
          <span className={styles.hint}>Tamaño max: {(maxSize / 1024 / 1024).toFixed(0)}MB</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        hidden
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
