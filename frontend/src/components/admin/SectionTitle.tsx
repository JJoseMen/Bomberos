import styles from './SectionTitle.module.scss';

interface SectionTitleProps {
  breadcrumb: string[];
  titulo: string;
  subtitulo?: string;
}

export function SectionTitle({ breadcrumb, titulo, subtitulo }: SectionTitleProps) {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        {breadcrumb.map((item, index) => (
          <span key={index} className={styles.breadcrumbItem}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
            <span
              className={
                index === breadcrumb.length - 1 ? styles.breadcrumbActive : styles.breadcrumbInactive
              }
              aria-current={index === breadcrumb.length - 1 ? 'page' : undefined}
            >
              {item}
            </span>
          </span>
        ))}
      </nav>
      <h1 className={styles.titulo}>{titulo}</h1>
      {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
    </div>
  );
}
