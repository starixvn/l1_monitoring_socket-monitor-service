"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __importDefault(require("../container"));
const express_1 = require("express");
const SocketIOServiceMonitor_1 = require("../services/SocketIOServiceMonitor");
const router = (0, express_1.Router)();
const monitors = [];
const services = [
    { url: "http://localhost:3000", interval: 5000 },
    { url: "http://localhost:4000", interval: 5000 },
];
const prometheusClient = container_1.default.resolve("prometheusClient");
const config = container_1.default.resolve("config");
const logger = container_1.default.resolve("logger");
// Initialize monitors
config.services.forEach((service) => {
    const monitor = new SocketIOServiceMonitor_1.SocketIOServiceMonitor({
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
exports.default = router;
