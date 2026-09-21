import { Outlet } from 'react-router-dom';
import { Header } from '@/components/shared/Header/Header';
import { Footer } from '@/components/shared/Footer/Footer';
import styles from './PublicLayout.module.scss';

export function PublicLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
