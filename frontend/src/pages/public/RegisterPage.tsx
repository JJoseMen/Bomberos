import { Link } from 'react-router-dom';
import { Input, Button, Select } from '@/components/ui';

export function RegisterPage() {
  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Registro</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Nombre" required />
          <Input label="Apellido" required />
        </div>
        <Input label="Email" type="email" required />
        <Input label="Contrasena" type="password" required />
        <Select
          label="Tipo de persona"
          options={[
            { value: 'NATURAL', label: 'Natural' },
            { value: 'JURIDICA', label: 'Juridica' },
          ]}
          required
        />
        <Input label="Telefono" />
        <Button type="submit" fullWidth>
          Registrarse
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#757575' }}>
        Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: '#c62828' }}>
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
