import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { CiudadanoLayout } from '@/layouts/CiudadanoLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { OficialLayout } from '@/layouts/OficialLayout';
import { CajeroLayout } from '@/layouts/CajeroLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '@/pages/public/HomePage';
import { HistoriaPage } from '@/pages/public/HistoriaPage';
import { UbicacionPage } from '@/pages/public/UbicacionPage';
import { ContactosPage } from '@/pages/public/ContactosPage';
import { TramitesPage } from '@/pages/public/TramitesPage';
import { ConsultaPublicaPage } from '@/pages/public/ConsultaPublicaPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { VerifyOtpPage } from '@/pages/auth/VerifyOtpPage';
import { KerberosCallbackPage } from '@/pages/auth/KerberosCallbackPage';
import { DashboardPage } from '@/pages/ciudadano/DashboardPage';
import { MisSolicitudesPage } from '@/pages/ciudadano/MisSolicitudesPage';
import { NuevaSolicitudPage } from '@/pages/ciudadano/NuevaSolicitudPage';
import { SolicitudDetallePage } from '@/pages/ciudadano/SolicitudDetallePage';
import { FormularioTramitePage } from '@/pages/ciudadano/FormularioTramitePage';
import { NotificacionesPage } from '@/pages/notificaciones/NotificacionesPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { SolicitudesListPage } from '@/pages/admin/SolicitudesListPage';
import { AdminSolicitudDetallePage } from '@/pages/admin/SolicitudDetallePage';
import { UsuariosPage } from '@/pages/admin/UsuariosPage';
import { CertificadosPage } from '@/pages/admin/CertificadosPage';
import { PagosPage } from '@/pages/admin/PagosPage';
import { ReportesPage } from '@/pages/admin/ReportesPage';
import { AuditoriaPage } from '@/pages/admin/AuditoriaPage';
import { OficialDashboardPage } from '@/pages/oficial/OficialDashboardPage';
import { SolicitudesAsignadasPage } from '@/pages/oficial/SolicitudesAsignadasPage';
import { RevisionDocumentosPage } from '@/pages/oficial/RevisionDocumentosPage';
import { InspeccionesPage } from '@/pages/oficial/InspeccionesPage';
import { EmisionCertificadosPage } from '@/pages/oficial/EmisionCertificadosPage';
import { CajeroDashboardPage } from '@/pages/cajero/CajeroDashboardPage';
import { VerificacionPagosPage } from '@/pages/cajero/VerificacionPagosPage';
import { EntregaCertificadosPage } from '@/pages/cajero/EntregaCertificadosPage';
import { ReportesCajaPage } from '@/pages/cajero/ReportesCajaPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/historia', element: <HistoriaPage /> },
      { path: '/ubicacion', element: <UbicacionPage /> },
      { path: '/contactos', element: <ContactosPage /> },
      { path: '/tramites', element: <TramitesPage /> },
      { path: '/consulta', element: <ConsultaPublicaPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-otp', element: <VerifyOtpPage /> },
      { path: '/kerberos/callback', element: <KerberosCallbackPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['EXTERNO']}>
        <CiudadanoLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/mis-solicitudes', element: <MisSolicitudesPage /> },
      { path: '/solicitudes/nueva', element: <NuevaSolicitudPage /> },
      { path: '/solicitudes/nueva/:tipo', element: <FormularioTramitePage /> },
      { path: '/solicitudes/:codigo', element: <SolicitudDetallePage /> },
      { path: '/notificaciones', element: <NotificacionesPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin/dashboard', element: <AdminDashboardPage /> },
      { path: '/admin/solicitudes', element: <SolicitudesListPage /> },
      { path: '/admin/solicitudes/:codigo', element: <AdminSolicitudDetallePage /> },
      { path: '/admin/usuarios', element: <UsuariosPage /> },
      { path: '/admin/certificados', element: <CertificadosPage /> },
      { path: '/admin/pagos', element: <PagosPage /> },
      { path: '/admin/reportes', element: <ReportesPage /> },
      { path: '/admin/auditoria', element: <AuditoriaPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['OFICIAL']}>
        <OficialLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/oficial/dashboard', element: <OficialDashboardPage /> },
      { path: '/oficial/solicitudes', element: <SolicitudesAsignadasPage /> },
      { path: '/oficial/solicitudes/:codigo', element: <RevisionDocumentosPage /> },
      { path: '/oficial/inspecciones', element: <InspeccionesPage /> },
      { path: '/oficial/certificados', element: <EmisionCertificadosPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['CAJERO']}>
        <CajeroLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/cajero/dashboard', element: <CajeroDashboardPage /> },
      { path: '/cajero/pagos', element: <VerificacionPagosPage /> },
      { path: '/cajero/entrega', element: <EntregaCertificadosPage /> },
      { path: '/cajero/reportes', element: <ReportesCajaPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
