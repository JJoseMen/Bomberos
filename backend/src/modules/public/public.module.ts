import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { CertificadosPublicController } from './certificados-public.controller';
import { CertificadosPublicService } from './certificados-public.service';

@Module({
  controllers: [PublicController, CertificadosPublicController],
  providers: [PublicService, CertificadosPublicService],
})
export class PublicModule {}
