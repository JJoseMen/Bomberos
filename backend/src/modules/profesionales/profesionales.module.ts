import { Module } from '@nestjs/common';
import { ProfesionalesController } from './profesionales.controller';
import { ProfesionalesService } from './profesionales.service';
import { CertificadosPdfService } from '../certificados/certificados-pdf.service';

@Module({
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService, CertificadosPdfService],
  exports: [ProfesionalesService],
})
export class ProfesionalesModule {}
