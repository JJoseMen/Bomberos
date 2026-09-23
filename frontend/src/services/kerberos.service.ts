import type { KerberosUser, KerberosTicketResponse, KerberosRol } from '@/types/kerberos.types';

const MOCK_USERS: (KerberosUser & { password: string })[] = [
  {
    ci: '7711111',
    password: '123456',
    nombre: 'Admin Sistema',
    grado: 'Tcn. 1',
    unidad: 'Comando Nacional',
    email: 'admin@sippci.gob.bo',
    rol: 'ADMIN',
  },
  {
    ci: '9905200',
    password: '123456',
    nombre: 'Gestor Cumplimiento',
    grado: 'Tcn. 1',
    unidad: 'Comando Nacional',
    email: 'cumplimiento@sippci.gob.bo',
    rol: 'GESTOR_CUMPLIMIENTO',
  },
  {
    ci: '6622222',
    password: '123456',
    nombre: 'Gestor Capacitaciones',
    grado: 'Tcn. 1',
    unidad: 'Comando Nacional',
    email: 'capacitaciones@sippci.gob.bo',
    rol: 'GESTOR_CAPACITACIONES',
  },
  {
    ci: '8812345',
    password: '123456',
    nombre: 'Gestor Registro',
    grado: 'Tcn. 1',
    unidad: 'Comando Nacional',
    email: 'registro@sippci.gob.bo',
    rol: 'GESTOR_REGISTRO_PROFESIONAL',
  },
  {
    ci: '5555555',
    password: '123456',
    nombre: 'Cajero Sistema',
    grado: 'Tcn. 1',
    unidad: 'Comando Nacional',
    email: 'cajero@sippci.gob.bo',
    rol: 'CAJERO',
  },
];

function generarTicketMock(rol: KerberosRol): string {
  switch (rol) {
    case 'ADMIN':
      return 'admin-mock-ticket';
    case 'GESTOR_CUMPLIMIENTO':
      return 'cumplimiento-mock-ticket';
    case 'GESTOR_CAPACITACIONES':
      return 'capacitacion-mock-ticket';
    case 'GESTOR_REGISTRO_PROFESIONAL':
      return 'registro-mock-ticket';
    case 'CAJERO':
      return 'cajero-mock-ticket';
    default:
      return 'cumplimiento-mock-ticket';
  }
}

export const kerberosService = {
  async loginKerberos(ci: string, password: string): Promise<KerberosTicketResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find((u) => u.ci === ci && u.password === password);

    if (!user) {
      throw new Error('Credenciales inválidas. Verifique su CI y contraseña.');
    }

    const ticket = generarTicketMock(user.rol);

    const { password: _, ...userData } = user;
    localStorage.setItem('kerberosUser', JSON.stringify(userData));
    localStorage.setItem('kerberosTicket', ticket);

    return { ticket, user: userData };
  },

  getKerberosUserData(): KerberosUser | null {
    try {
      const raw = localStorage.getItem('kerberosUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getKerberosTicket(): string | null {
    return localStorage.getItem('kerberosTicket');
  },

  logoutKerberos(): void {
    localStorage.removeItem('kerberosUser');
    localStorage.removeItem('kerberosTicket');
  },
};
