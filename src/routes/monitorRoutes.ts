import container from "../container";
import { Router } from "express";
import { SocketIOServiceMonitor } from "../services/SocketIOServiceMonitor";
import { Logger } from "../utils/Logger";

const router = Router();
const monitors: SocketIOServiceMonitor[] = [];

const services = [
    { url: "http://localhost:3000", interval: 5000 },
    { url: "http://localhost:4000", interval: 5000 },
];

const prometheusClient = container.resolve("prometheusClient");
const config = container.resolve("config");
const logger = container.resolve<typeof Logger>("logger");

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

router.get("/status", (req, res) => {
    res.json({
        services: services.map((service, index) => ({
            url: service.url,
            interval: service.interval,
            connected: monitors[index].isConnected(),
        })),
    });
});

export default router;
