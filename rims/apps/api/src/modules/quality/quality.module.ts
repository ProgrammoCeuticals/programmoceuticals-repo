import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { QualityService } from './quality.service';
import { QualityController } from './quality.controller';

@Module({
  imports: [AuditModule],
  providers: [QualityService],
  controllers: [QualityController],
  exports: [QualityService],
})
export class QualityModule {}
