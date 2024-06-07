import { IServiceMonitor } from "../interfaces/IServiceMonitor";
import { IMetricsClient } from "../interfaces/IMetricsCLient";
import { Logger } from "../utils/Logger";
import { io, Socket } from "socket.io-client";

interface SocketIOServiceMonitorDependencies {
    url: string;
    interval: number;
    metricsClient: IMetricsClient;
    logger: typeof Logger;
}

export class SocketIOServiceMonitor implements IServiceMonitor {
    private socket: Socket | null = null;
    private pingInterval: NodeJS.Timeout | null = null;
    private url: string;
    private interval: number;
    private metricsClient: IMetricsClient;
    private logger: typeof Logger;

    constructor({ url, interval, metricsClient, logger }: SocketIOServiceMonitorDependencies) {
        this.url = url;
        this.interval = interval;
        this.metricsClient = metricsClient;
        debugger;
        this.logger = logger;
    }

    connect(): void {
        this.socket = io(this.url);

        this.socket.on("connect", () => {
            this.logger.log(`Connected to ${this.url}`);
            this.startPinging();
        });

        this.socket.on("connect_error", (error) => {
            this.logger.error(`Connection error to ${this.url}: ${error}`);
        });

        this.socket.on("disconnect", () => {
            this.logger.log(`Disconnected from ${this.url}`);
            this.stopPinging();
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    private startPinging(): void {
        this.pingInterval = setInterval(async () => {
            const startTime = Date.now();
            this.socket!.emit("ping", async () => {
                const latency = Date.now() - startTime;
                Logger.log(`Latency to ${this.url}: ${latency} ms`);
                this.metricsClient.setLatency(this.url, latency);
                await this.metricsClient.pushMetrics();
            });
        }, this.interval);
    }

    private stopPinging(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}
