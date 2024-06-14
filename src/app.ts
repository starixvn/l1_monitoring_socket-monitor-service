import express from "express";
import container from "./container";
import { SocketIOServiceMonitor } from "./services/SocketIOServiceMonitor";
import { Logger } from "./utils/Logger";

const app = express();
app.use(express.json());

const config = container.resolve("config");
const prometheusClient = container.resolve("prometheusClient");
const logger = container.resolve<typeof Logger>("logger");

const monitors: SocketIOServiceMonitor[] = [];

config.services.forEach((service: { route: string; url: string; interval: number; env: string }) => {
    const monitor = new SocketIOServiceMonitor({
        route: service.route,
        url: service.url,
        interval: service.interval,
        metricsClient: prometheusClient,
        env: service.env ?? "",
        logger: logger,
    });

    monitors.push(monitor);
    monitor.connect();
});

export default app;
