export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipo: string;
  estado: string;
  createdAt: string;
}

export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  tipo: string;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  estado?: string;
}
