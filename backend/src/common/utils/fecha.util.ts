export function calcularVencimiento(fechaAprobacion: Date): Date {
  const venc = new Date(fechaAprobacion);
  venc.setFullYear(venc.getFullYear() + 2);
  return venc;
}

export function calcularDiasParaVencer(fechaVencimiento: Date): number {
  const hoy = new Date();
  const diff = fechaVencimiento.getTime() - hoy.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function estaVencido(fechaVencimiento: Date): boolean {
  return new Date() > fechaVencimiento;
}

export function formatearFecha(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}
