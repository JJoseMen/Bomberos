import { Module } from '@nestjs/common';
import { RenovacionesService } from './renovaciones.service';
import { RenovacionesController } from './renovaciones.controller';

@Module({
  controllers: [RenovacionesController],
  providers: [RenovacionesService],
  exports: [RenovacionesService],
})
export class RenovacionesModule {}
