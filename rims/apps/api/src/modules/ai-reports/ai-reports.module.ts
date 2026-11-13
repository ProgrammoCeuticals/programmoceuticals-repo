import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from '../reports/reports.module';
import { AiReportsService } from './ai-reports.service';
import { AiReportsController } from './ai-reports.controller';

@Module({
  imports: [ConfigModule, ReportsModule],
  providers: [AiReportsService],
  controllers: [AiReportsController],
  exports: [AiReportsService],
})
export class AiReportsModule {}
