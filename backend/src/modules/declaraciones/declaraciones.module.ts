import { Module } from '@nestjs/common';
import { DeclaracionesService } from './declaraciones.service';
import { DeclaracionesController } from './declaraciones.controller';

@Module({
  controllers: [DeclaracionesController],
  providers: [DeclaracionesService],
  exports: [DeclaracionesService],
})
export class DeclaracionesModule {}
