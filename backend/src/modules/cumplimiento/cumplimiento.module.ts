import { Module } from '@nestjs/common';
import { CumplimientoController } from './cumplimiento.controller';
import { CumplimientoService } from './cumplimiento.service';
import { CertificadosPdfService } from '../certificados/certificados-pdf.service';

@Module({
  controllers: [CumplimientoController],
  providers: [CumplimientoService, CertificadosPdfService],
  exports: [CumplimientoService],
})
export class CumplimientoModule {}
