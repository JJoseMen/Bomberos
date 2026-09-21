import { useState } from 'react';
import { toast } from 'sonner';
import { Input, Button } from '@/components/ui';
import { formatMoney } from '@/lib/format';
import { pagosService } from '@/services/pagos.service';
import styles from './RegistrarPago.module.scss';

export function RegistrarPago({ codigo, monto }: { codigo: string; monto: number }) {
  const [numeroOperacion, setNumeroOperacion] = useState('');
  const [montoPagado, setMontoPagado] = useState(String(monto));
  const [fechaDeposito, setFechaDeposito] = useState('');
  const [banco, setBanco] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistrar = async () => {
    console.log('registrar pago', { codigo, numeroOperacion, montoPagado, fechaDeposito, banco });
    const montoNum = Number(montoPagado);
    if (!codigo) {
      toast.error('Falta el codigo de solicitud');
      return;
    }
    if (!montoNum || montoNum <= 0) {
      toast.error('Ingresa un monto valido');
      return;
    }
    setLoading(true);
    try {
      const res = await pagosService.registrar(codigo, {
        numeroOperacion: numeroOperacion || undefined,
        monto: montoNum,
        fechaDeposito: fechaDeposito || undefined,
        banco: banco || undefined,
      });
      console.log('pago registrado', res);
      toast.success('Pago registrado');
    } catch (e) {
      console.log('error pago', e);
      toast.error('No se pudo registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['box']}>
      <div className={styles['monto']}>Total a pagar: {formatMoney(monto)}</div>
      <Input
        label="Numero de operacion"
        placeholder="Nro deposito"
        value={numeroOperacion}
        onChange={(e) => setNumeroOperacion(e.target.value)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Monto"
          type="number"
          placeholder="0.00"
          value={montoPagado}
          onChange={(e) => setMontoPagado(e.target.value)}
        />
        <Input
          label="Fecha deposito"
          type="date"
          value={fechaDeposito}
          onChange={(e) => setFechaDeposito(e.target.value)}
        />
      </div>
      <Input
        label="Banco"
        placeholder="Banco"
        value={banco}
        onChange={(e) => setBanco(e.target.value)}
      />
      <Button variant="primary" onClick={handleRegistrar} loading={loading}>
        Registrar pago
      </Button>
    </div>
  );
}
