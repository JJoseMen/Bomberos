import { Module } from '@nestjs/common';
import { SippciService } from './sippci.service';
import { SippciController } from './sippci.controller';

@Module({
  controllers: [SippciController],
  providers: [SippciService],
  exports: [SippciService],
})
export class SippciModule {}
