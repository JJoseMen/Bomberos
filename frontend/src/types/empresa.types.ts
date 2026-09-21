export interface Empresa {
  id: number;
  razonSocial: string;
  nit: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: string;
  createdAt: string;
}

export interface CreateEmpresaDto {
  razonSocial: string;
  nit: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface UpdateEmpresaDto {
  razonSocial?: string;
  nit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado?: string;
}
