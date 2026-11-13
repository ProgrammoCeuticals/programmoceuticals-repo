import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';

@Module({
  imports: [AuditModule],
  providers: [PublicationsService],
  controllers: [PublicationsController],
  exports: [PublicationsService],
})
export class PublicationsModule {}
