import { Link } from 'react-router-dom';
import { Flame, Phone } from 'lucide-react';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Grid 4 columnas superiores */}
        <div className={styles.grid}>
          {/* Col 1: Marca + badge */}
          <div className={styles.col}>
            <div className={styles.brand}>
              <div className={styles.brandIcon}>
                <Flame size={20} aria-hidden="true" />
              </div>
              <div className={styles.brandTextBlock}>
                <span className={styles.brandTitle}>SIPPCI V2.0</span>
                <span className={styles.brandSubtitle}>
                  Dirección Nacional de Bomberos · Policía Boliviana
                </span>
              </div>
            </div>
            <p className={styles.description}>
              Sistema Integral de Prevención y Protección Contra Incendios. Plataforma soberana
              para la certificación, registro y validación de trámites ciudadanos.
            </p>
            <span className={styles.badge}>Certificación Oficial Ley N° 449</span>
          </div>

          {/* Col 2: Trámites */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Trámites</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/tramites" className={styles.link}>
                  Registro Profesional
                </Link>
              </li>
              <li>
                <Link to="/tramites" className={styles.link}>
                  Capacitaciones
                </Link>
              </li>
              <li>
                <Link to="/tramites" className={styles.link}>
                  Certificación SIPPCI
                </Link>
              </li>
              <li>
                <Link to="/consulta" className={styles.link}>
                  Verificación de Autenticidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institucional */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Institucional</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/historia" className={styles.link}>
                  Historia
                </Link>
              </li>
              <li>
                <Link to="/historia" className={styles.link}>
                  Misión y Valores
                </Link>
              </li>
              <li>
                <Link to="/ubicacion" className={styles.link}>
                  Directorio Departamental
                </Link>
              </li>
              <li>
                <span className={styles.linkMuted}>Marco Legal Ley 449</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Ayuda y Contacto */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Ayuda y Contacto</h4>
            <ul className={styles.linkList}>
              <li className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} aria-hidden="true" />
                <span className={styles.contactText}>Línea Gratuita: </span>
                <span className={styles.contactNumber}>119</span>
              </li>
              <li>
                <Link to="/contactos" className={styles.link}>
                  Denuncias PQRS
                </Link>
              </li>
              <li>
                <Link to="/contactos" className={styles.link}>
                  Horarios de Atención
                </Link>
              </li>
              <li>
                <Link to="/ubicacion" className={styles.link}>
                  Oficinas Nacionales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Col 5: Copyright inferior */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © 2026 Dirección Nacional de Bomberos - Policía Boliviana. Todos los derechos reservados.
          </span>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>
              Políticas de Privacidad
            </a>
            <span className={styles.separator}>·</span>
            <a href="#" className={styles.bottomLink}>
              Accesibilidad
            </a>
            <span className={styles.separator}>·</span>
            <a href="#" className={styles.bottomLink}>
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
