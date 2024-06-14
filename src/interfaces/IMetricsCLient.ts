export interface IMetricsClient {
    setLatency(route: string, serviceUrl: string, latency: number): void;
    pushMetrics(): Promise<void>;
}
