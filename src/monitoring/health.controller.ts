import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrometheusService } from './prometheus.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('monitoring')
@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prometheusService: PrometheusService,
  ) { }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ]);
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Check if application is ready' })
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  @ApiOperation({ summary: 'Check if application is alive' })
  live() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  getMetrics() {
    return this.prometheusService.getMetrics();
  }
}
