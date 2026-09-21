import { Module } from '@nestjs/common';
import { CapacitacionesService } from './capacitaciones.service';
import { CapacitacionesController } from './capacitaciones.controller';
import { ExcelService } from './services/excel.service';

@Module({
  controllers: [CapacitacionesController],
  providers: [CapacitacionesService, ExcelService],
  exports: [CapacitacionesService],
})
export class CapacitacionesModule {}
