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

// Initialize monitors
config.services.forEach((service: { url: string; interval: number }) => {
    const monitor = new SocketIOServiceMonitor({
        url: service.url,
        interval: service.interval,
        metricsClient: prometheusClient,
        logger,
    });
    monitors.push(monitor);
    monitor.connect();
});

export default app;
