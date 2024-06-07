"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusClient = void 0;
const prom_client_1 = require("prom-client");
class PrometheusClient {
    constructor({ config }) {
        this.jobName = "service_latency_ms";
        this.registry = new prom_client_1.Registry();
        this.jobName = config.jobName;
        this.latencyGauge = new prom_client_1.Gauge({
            name: this.jobName,
            help: "Latency of the service in milliseconds",
            labelNames: ["service_url"],
        });
        this.registry.registerMetric(this.latencyGauge);
        this.pushGateway = new prom_client_1.Pushgateway(config.pushGatewayUrl, {}, this.registry);
        this.registry.setDefaultLabels({ job: this.jobName });
    }
    setLatency(serviceUrl, latency) {
        this.latencyGauge.set({ service_url: serviceUrl }, latency);
    }
    pushMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.pushGateway.pushAdd({ jobName: this.jobName });
            }
            catch (err) {
                console.error("Error pushing metrics to Push Gateway:", err);
            }
        });
    }
}
exports.PrometheusClient = PrometheusClient;
