import { TipoPersona } from './common.types';

export interface RegisterDto {
  nombreCompleto: string;
  email: string;
  password: string;
  tipoPersona: TipoPersona;
  telefono?: string;
  ci?: string;
  nit?: string;
  departamento?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyOtpDto {
  email: string;
  codigo: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface KerberosExchangeDto {
  ticket: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  tipo: string;
  tipoPersona?: TipoPersona;
}

export interface AuthResponse {
  access_token: string;
  user?: AuthUser;
  _devOtp?: string;
}
