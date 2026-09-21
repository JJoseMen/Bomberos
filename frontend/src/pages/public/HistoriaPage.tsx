import styles from './HistoriaPage.module.scss';

export function HistoriaPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Nuestra Historia</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mision</h2>
        <p className={styles.text}>
          Brindar proteccion integral a la ciudadania a traves de la prevencion, atencion y control
          de emergencias, garantizando la seguridad de las personas, el patrimonio y el medio
          ambiente, con personal altamente capacitado y equipamiento moderno.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Vision</h2>
        <p className={styles.text}>
          Ser una institucion de excelencia en la proteccion civil, reconocida por su eficiencia,
          profesionalismo y compromiso con la comunidad, liderando la modernizacion de los cuerpos
          de bomberos en Bolivia.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Valores</h2>
        <div className={styles.values}>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Valor</h3>
            <p className={styles.valueDesc}>Coraje y valentia ante las adversidades</p>
          </div>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Disciplina</h3>
            <p className={styles.valueDesc}>Compromiso con el deber y la responsabilidad</p>
          </div>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Lealtad</h3>
            <p className={styles.valueDesc}>Fidelidad a la institucion y a la comunidad</p>
          </div>
          <div className={styles.valueCard}>
            <h3 className={styles.valueTitle}>Solidaridad</h3>
            <p className={styles.valueDesc}>Apoyo mutuo en situaciones de emergencia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
