import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm', { locale: es });
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-BO').format(n);
}

export function maskName(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length <= 1) return parts[0] + ' *';
  return parts[0] + ' ' + parts[parts.length - 1].charAt(0) + '.';
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}
