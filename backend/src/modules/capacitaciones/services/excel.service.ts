import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

export interface ParticipanteExcel {
  nombre: string;
  ci: string;
  expedido: string;
  cursos: string[];
  email?: string;
  telefono?: string;
}

const CURSOS_VALIDOS = ['EXTINTORES', 'PRIMEROS_AUXILIOS', 'EVACUACION', 'TRABAJOS_EN_ALTURA'];

@Injectable()
export class ExcelService {
  parsearLista(buffer: Buffer): ParticipanteExcel[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    if (!rows.length) throw new BadRequestException('El archivo esta vacio');

    const participantes: ParticipanteExcel[] = [];
    const cis = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nombre = String(row['Nombre completo'] ?? row['nombre'] ?? '').trim();
      const ci = String(row['Carnet'] ?? row['carnet'] ?? '').trim();
      const expedido = String(row['Expedido'] ?? row['expedido'] ?? 'LP').trim();
      const email = row['Email'] ? String(row['Email']).trim() : undefined;
      const telefono = row['Telefono'] ? String(row['Telefono']).trim() : undefined;

      if (!nombre || !ci) {
        throw new BadRequestException(`Fila ${i + 2}: Nombre y carnet son obligatorios`);
      }
      if (cis.has(ci)) {
        throw new BadRequestException(`Fila ${i + 2}: Carnet ${ci} duplicado`);
      }
      cis.add(ci);

      const cursosRaw = String(row['Curso(s)'] ?? row['cursos'] ?? '');
      const cursos = cursosRaw.split(/[,;]+/).map(c => c.trim().toUpperCase()).filter(Boolean);

      for (const curso of cursos) {
        if (!CURSOS_VALIDOS.includes(curso)) {
          throw new BadRequestException(`Fila ${i + 2}: Curso "${curso}" no es valido. Valores: ${CURSOS_VALIDOS.join(', ')}`);
        }
      }

      participantes.push({ nombre, ci, expedido, cursos, email, telefono });
    }
    return participantes;
  }
}
