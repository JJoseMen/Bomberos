import { Flame } from 'lucide-react';
import styles from './HeroSection.module.scss';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Grid técnico sutil */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        {/* Columna izquierda 7/12 */}
        <div className={styles.left}>
          <span className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            DIRECCIÓN NACIONAL DE BOMBEROS · SIPPCI V2.0
          </span>

          <h1 className={styles.title}>
            Al servicio de la comunidad con{' '}
            <span className={styles.gold}>valor</span>,{' '}
            <span className={styles.whiteWord}>disciplina</span> y{' '}
            <span className={styles.redWord}>lealtad</span>.
          </h1>

          <p className={styles.subtitle}>
            Plataforma tecnológica institucional soberana para la validación, emisión y seguimiento
            de trámites ciudadanos en tiempo real.
          </p>
        </div>

        {/* Columna derecha 5/12 */}
        <div className={styles.right}>
          <div className={styles.imageWrap}>
            <img
              src="https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?auto=format&fit=crop&w=800&q=80"
              alt="Bomberos en servicio"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.imageBadge}>
              <Flame size={16} className={styles.imageBadgeIcon} aria-hidden="true" />
              <span>
                Dirección Nacional
                <br />
                Bomberos de Bolivia
              </span>
            </div>
            <span className={styles.cornerFlame} aria-hidden="true">
              <Flame size={18} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
