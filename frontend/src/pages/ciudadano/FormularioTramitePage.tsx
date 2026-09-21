import { useParams } from 'react-router-dom';
import { FormularioProfesional } from '@/features/solicitudes/components/FormularioProfesional';
import { FormularioCapacitacion } from '@/features/solicitudes/components/FormularioCapacitacion';
import { FormularioSIPPCI } from '@/features/solicitudes/components/FormularioSIPPCI';
import styles from './FormularioTramitePage.module.scss';

export function FormularioTramitePage() {
  const { tipo } = useParams<{ tipo: string }>();

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Tramite: {tipo}</h1>
      {tipo === 'profesional' && <FormularioProfesional />}
      {tipo === 'capacitacion' && <FormularioCapacitacion />}
      {tipo === 'sippci' && <FormularioSIPPCI />}
      {!tipo && <p>Selecciona un tramite</p>}
    </div>
  );
}
