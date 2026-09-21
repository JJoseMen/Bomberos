import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

export const registerSchema = z.object({
  nombreCompleto: z.string().min(2, 'Minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
  tipoPersona: z.enum(['NATURAL', 'JURIDICA']),
  telefono: z.string().optional(),
  ci: z.string().optional(),
  nit: z.string().optional(),
  departamento: z.string().optional(),
});

export const otpSchema = z.object({
  email: z.string().email('Email invalido'),
  codigo: z.string().length(6, 'Debe ser 6 caracteres'),
});

export const pagoSchema = z.object({
  numeroOperacion: z.string().min(1, 'Requerido'),
  monto: z.number().positive('Debe ser positivo'),
  fechaDeposito: z.string().min(1, 'Requerido'),
  banco: z.string().min(1, 'Requerido'),
});

export const empresaSchema = z.object({
  razonSocial: z.string().min(2, 'Minimo 2 caracteres'),
  nit: z.string().min(5, 'Minimo 5 caracteres'),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PagoFormData = z.infer<typeof pagoSchema>;
export type EmpresaFormData = z.infer<typeof empresaSchema>;
