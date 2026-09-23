import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import styles from './AdminLayout.module.scss';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.content}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
