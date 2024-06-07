// src/interfaces/IMetricsClient.ts
export interface IMetricsClient {
    setLatency(serviceUrl: string, latency: number): void;
    pushMetrics(): Promise<void>;
}
