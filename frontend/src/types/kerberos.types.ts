export type KerberosRol =
  | 'ADMIN'
  | 'GESTOR_CUMPLIMIENTO'
  | 'GESTOR_CAPACITACIONES'
  | 'GESTOR_REGISTRO_PROFESIONAL'
  | 'CAJERO';

export interface KerberosUser {
  ci: string;
  nombre: string;
  grado: string;
  unidad: string;
  email: string;
  rol: KerberosRol;
}

export interface KerberosLoginDto {
  ci: string;
  password: string;
}

export interface KerberosTicketResponse {
  ticket: string;
  user: KerberosUser;
}
