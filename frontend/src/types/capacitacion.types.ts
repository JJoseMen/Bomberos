export type NombreCurso = 'EXTINTORES' | 'PRIMEROS_AUXILIOS' | 'EVACUACION' | 'TRABAJOS_EN_ALTURA';

export interface Curso {
  id: number;
  nombre: NombreCurso;
  descripcion: string;
  duracionHoras: number;
  duracionUfv: number;
  costoUnitario: number;
}

export interface Participante {
  id: number;
  capacitacionId: number;
  nombre: string;
  apellido: string;
  ci: string;
  email?: string;
  telefono?: string;
  estado: string;
  createdAt: string;
}

export interface Capacitacion {
  id: number;
  cursoId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  curso?: Curso;
  participantes?: Participante[];
}

export interface AgregarParticipanteDto {
  nombre: string;
  apellido: string;
  ci: string;
  email?: string;
  telefono?: string;
}

export interface CostoTotalResponse {
  totalParticipantes: number;
  costoUnitario: number;
  costoTotal: number;
}
