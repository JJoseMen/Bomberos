export interface Profesional {
  id: number;
  codigoRegistro: string;
  nombre: string;
  apellido: string;
  ci: string;
  profesion: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
  usuarioId?: number;
  createdAt: string;
}

export interface CrearProfesionalDto {
  nombre: string;
  apellido: string;
  ci: string;
  profesion: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
}
