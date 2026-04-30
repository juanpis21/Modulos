import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusService } from './prometheus.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [PrometheusService],
  exports: [PrometheusService],
})
export class MonitoringModule {}
