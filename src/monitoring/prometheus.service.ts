import { Injectable, OnModuleInit } from '@nestjs/common';
import { register, Counter, Histogram, Gauge, Registry } from 'prom-client';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private register: Registry;

  // Contadores
  private httpRequestsTotal: Counter<string>;
  private activeConnections: Gauge<string>;
  private databaseConnections: Gauge<string>;

  // Histogramas
  private httpRequestDuration: Histogram<string>;
  private databaseQueryDuration: Histogram<string>;

  constructor() {
    this.register = new Registry();
    this.register.setDefaultLabels({
      app: 'clinic-pet-api',
    });
  }

  onModuleInit() {
    // Inicializar métricas
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [this.register],
    });

    this.databaseConnections = new Gauge({
      name: 'database_connections',
      help: 'Number of active database connections',
      registers: [this.register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.register],
    });

    this.databaseQueryDuration = new Histogram({
      name: 'database_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['query_type'],
      buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
      registers: [this.register],
    });
  }

  // Métodos para actualizar métricas
  incrementHttpRequests(method: string, route: string, statusCode: string) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
  }

  observeHttpRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  setDatabaseConnections(count: number) {
    this.databaseConnections.set(count);
  }

  observeDatabaseQueryDuration(queryType: string, duration: number) {
    this.databaseQueryDuration.observe({ query_type: queryType }, duration);
  }

  // Obtener métricas en formato Prometheus
  async getMetrics(): Promise<string> {
    return await this.register.metrics();
  }

  // Obtener el registro para usar en otros módulos
  getRegistry(): Registry {
    return this.register;
  }
}
