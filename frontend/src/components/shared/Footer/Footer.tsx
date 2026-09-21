import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>DNB</div>
            <span className={styles.brandText}>Direccion Nacional de Bomberos</span>
          </div>
          <div className={styles.info}>
            Sistema de Planificacion y Supervision de la Actividad de los Cuerpos de Bomberos
          </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.bottom}>
          <span>&copy; 2026 Direccion Nacional de Bomberos - Policía Boliviana</span>
          <span>Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
}
