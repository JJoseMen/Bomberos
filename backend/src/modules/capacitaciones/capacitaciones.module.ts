import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { CapacitacionesService } from './capacitaciones.service';
import {
  CapacitacionesController,
  CertificadoPublicoController,
} from './capacitaciones.controller';
import { RegistroCapacitacionesService } from './registro-capacitaciones.service';
import { RevisionCapacitacionesService } from './revision-capacitaciones.service';
import { ExcelService } from './services/excel.service';
import { PdfService } from './services/pdf.service';

@Module({
  imports: [NotificacionesModule],
  controllers: [CapacitacionesController, CertificadoPublicoController],
  providers: [
    CapacitacionesService,
    RegistroCapacitacionesService,
    RevisionCapacitacionesService,
    ExcelService,
    PdfService,
  ],
  exports: [CapacitacionesService, RegistroCapacitacionesService, RevisionCapacitacionesService],
})
export class CapacitacionesModule {}