import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import styles from './ContactosPage.module.scss';

export function ContactosPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Contactos</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <Phone size={32} className={styles.icon} />
          <h3 className={styles.cardTitle}>Telefono</h3>
          <p className={styles.cardValue}>+591 2 2123456</p>
        </div>
        <div className={styles.card}>
          <Mail size={32} className={styles.icon} />
          <h3 className={styles.cardTitle}>Email</h3>
          <p className={styles.cardValue}>info@bomberos.gov.bo</p>
        </div>
        <div className={styles.card}>
          <MapPin size={32} className={styles.icon} />
          <h3 className={styles.cardTitle}>Direccion</h3>
          <p className={styles.cardValue}>Zona San Jorge, La Paz - Bolivia</p>
        </div>
        <div className={styles.card}>
          <Clock size={32} className={styles.icon} />
          <h3 className={styles.cardTitle}>Horario</h3>
          <p className={styles.cardValue}>Lunes a Viernes: 8:30 - 12:30 / 14:30 - 18:30</p>
        </div>
      </div>
    </div>
  );
}
