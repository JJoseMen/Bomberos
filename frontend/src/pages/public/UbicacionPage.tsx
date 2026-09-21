import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import styles from './UbicacionPage.module.scss';

export function UbicacionPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ubicacion</h1>

      <div className={styles.mapContainer}>
        <div style={{ textAlign: 'center' }}>
          <MapPin size={48} />
          <p style={{ marginTop: 8 }}>Mapa de ubicacion</p>
          <p style={{ fontSize: 14 }}>La Paz, Bolivia</p>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>Direccion</p>
          <p className={styles.infoValue}>
            <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Zona San Jorge, La Paz - Bolivia
          </p>
        </div>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>Telefono</p>
          <p className={styles.infoValue}>
            <Phone size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            +591 2 2123456
          </p>
        </div>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>Horario</p>
          <p className={styles.infoValue}>
            <Clock size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Lunes a Viernes: 8:30 - 12:30 / 14:30 - 18:30
          </p>
        </div>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>Email</p>
          <p className={styles.infoValue}>
            <Mail size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            info@bomberos.gov.bo
          </p>
        </div>
      </div>
    </div>
  );
}
