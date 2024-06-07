import { Registry, Gauge, Pushgateway, PrometheusContentType } from "prom-client";
import { IMetricsClient } from "../interfaces/IMetricsCLient";

interface PrometheusClientDependencies {
    config: {
        pushGatewayUrl: string;
        jobName: string;
    };
}

export class PrometheusClient implements IMetricsClient {
    private jobName: string = "service_latency_ms";
    private registry: Registry;
    private latencyGauge: Gauge<string>;
    private pushGateway: Pushgateway<PrometheusContentType>;

    constructor({ config }: PrometheusClientDependencies) {
        this.registry = new Registry();
        this.jobName = config.jobName;
        this.latencyGauge = new Gauge({
            name: this.jobName,
            help: "Latency of the service in milliseconds",
            labelNames: ["service_url"],
        });
        this.registry.registerMetric(this.latencyGauge);

        this.pushGateway = new Pushgateway(config.pushGatewayUrl, {}, this.registry);
        this.registry.setDefaultLabels({ job: this.jobName });
    }

    setLatency(serviceUrl: string, latency: number): void {
        this.latencyGauge.set({ service_url: serviceUrl }, latency);
    }

    async pushMetrics(): Promise<void> {
        try {
            await this.pushGateway.pushAdd({ jobName: this.jobName });
        } catch (err) {
            console.error("Error pushing metrics to Push Gateway:", err);
        }
    }
}
