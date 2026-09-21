import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '@/components/ui';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement login
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Iniciar Sesion</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Contrasena"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth>
          Ingresar
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#757575' }}>
        No tienes cuenta?{' '}
        <Link to="/register" style={{ color: '#c62828' }}>
          Registrate
        </Link>
      </p>
    </div>
  );
}
