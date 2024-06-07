"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/container.ts
const awilix_1 = require("awilix");
const PrometheusClient_1 = require("./utils/PrometheusClient");
const SocketIOServiceMonitor_1 = require("./services/SocketIOServiceMonitor");
const Logger_1 = require("./utils/Logger");
const AppConfig_1 = __importDefault(require("./AppConfig"));
const container = (0, awilix_1.createContainer)();
container.register({
    config: (0, awilix_1.asValue)(AppConfig_1.default),
    logger: (0, awilix_1.asValue)(Logger_1.Logger), // Register Logger as a value
    // logger: asClass(Logger).singleton(),
    prometheusClient: (0, awilix_1.asClass)(PrometheusClient_1.PrometheusClient).singleton(),
    socketIOServiceMonitor: (0, awilix_1.asClass)(SocketIOServiceMonitor_1.SocketIOServiceMonitor),
});
exports.default = container;
