import { IServiceMonitor } from "../interfaces/IServiceMonitor";
import { IMetricsClient } from "../interfaces/IMetricsCLient";
import { Logger } from "../utils/Logger";
import { io, Socket } from "socket.io-client";
import msgpackParser from "socket.io-msgpack-parser";

interface SocketIOServiceMonitorDependencies {
    route: string;
    url: string;
    interval: number;
    metricsClient: IMetricsClient;
    logger: typeof Logger;
}

export class SocketIOServiceMonitor implements IServiceMonitor {
    private socket: Socket | null = null;
    private pingInterval: NodeJS.Timeout | null = null;
    private route: string;
    private url: string;
    private interval: number;
    private metricsClient: IMetricsClient;
    private logger: typeof Logger;

    constructor({ route, url, interval, metricsClient, logger }: SocketIOServiceMonitorDependencies) {
        this.route = route;
        this.url = url;
        this.interval = interval;
        this.metricsClient = metricsClient;
        this.logger = logger;
    }
    //https://proxy.sabagame.com/minisedie/
    connect(): void {
        const useMsgpack = process.env.USE_MSGPACK === "true";
        const ioOptions = useMsgpack ? { parser: msgpackParser } : {};
        //http://proxy.sabagame.net
        const socketRoute = `wss://${this.route}/user/${this.url}`;
        // const socketRoute = `wss://l1-proxy1.lumigame.com/user/${this.url}`;
        const option = {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: `/${this.url}/socket.io`,
            parser: msgpackParser,
        };

        this.socket = io(socketRoute, option);

        this.socket.on("connect", () => {
            this.logger.log(`Connected to ${socketRoute}`);
            this.startPinging();
        });

        this.socket.on("connect_error", (error) => {
            this.logger.error(`Connection error to ${this.url}: ${error}`);
        });

        this.socket.on("disconnect", () => {
            this.logger.log(`Disconnected from  ${socketRoute}`);
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
                this.logger.log(`Latency to ${this.route}/${this.url}: ${latency} ms`);
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
