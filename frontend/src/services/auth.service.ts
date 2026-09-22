import api from '@/lib/api';
import type { LoginDto, VerifyOtpDto, RegisterDto, AuthResponse } from '@/types/auth.types';
import type { TipoPersona } from '@/types/common.types';

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async verifyOtp(data: VerifyOtpDto): Promise<AuthResponse> {
    const res = await api.post('/auth/verify-otp', data);
    return res.data;
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  },

  async getProfile(): Promise<{
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    tipo: string;
    tipoPersona?: TipoPersona;
  }> {
    const res = await api.get('/auth/perfil');
    return res.data;
  },

  async kerberosExchange(ticket: string): Promise<AuthResponse> {
    const res = await api.post('/auth/kerberos/exchange', { ticket });
    return res.data;
  },
};
