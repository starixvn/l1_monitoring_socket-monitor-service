import { Registry, Gauge, Pushgateway, PrometheusContentType } from "prom-client";
import { IMetricsClient } from "../interfaces/IMetricsCLient";
import { Logger } from "./Logger";

interface PrometheusClientDependencies {
    config: {
        pushGatewayUrl: string;
        jobName: string;
    };
    logger: typeof Logger;
}

export class PrometheusClient implements IMetricsClient {
    private jobName: string;
    private registry: Registry;
    private latencyGauge: Gauge<string>;
    private pushGateway: Pushgateway<PrometheusContentType>;
    private logger: typeof Logger;

    private options: any = {
        timeout: 2_000,
        agentOptions: {
            keepAlive: true,
            keepAliveMsecs: 10_000,
            maxSockets: 10,
        },
    };

    constructor({ config, logger }: PrometheusClientDependencies) {
        this.registry = new Registry();
        this.jobName = config.jobName;

        this.latencyGauge = new Gauge({
            name: this.jobName,
            help: "Latency of the service in milliseconds",
            labelNames: ["service_url", "route"],
        });

        this.registry.registerMetric(this.latencyGauge);

        this.pushGateway = new Pushgateway(config.pushGatewayUrl, this.options, this.registry);
        this.registry.setDefaultLabels({ job: this.jobName });

        this.logger = logger;
    }

    setLatency(route: string, serviceUrl: string, latency: number): void {
        this.latencyGauge.set({ route: route, service_url: serviceUrl }, latency);
    }

    async pushMetrics(): Promise<void> {
        try {
            await this.pushGateway.pushAdd({ jobName: this.jobName });
        } catch (err) {
            this.logger.error(`Error pushing metrics to Push Gateway: ${err}`);
        }
    }
}
