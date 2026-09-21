import { Checkbox } from '@/components/ui';
import styles from './RequisitosChecklist.module.scss';

export function RequisitosChecklist({
  requisitos,
}: {
  requisitos: { id: string; label: string; ok: boolean }[];
}) {
  return (
    <div className={styles['list']}>
      {requisitos.map((r) => (
        <div key={r.id} className={styles['item']}>
          <Checkbox label={r.label} checked={r.ok} readOnly />
        </div>
      ))}
    </div>
  );
}
