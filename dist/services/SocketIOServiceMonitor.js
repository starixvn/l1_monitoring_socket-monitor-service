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
exports.SocketIOServiceMonitor = void 0;
const Logger_1 = require("../utils/Logger");
const socket_io_client_1 = require("socket.io-client");
class SocketIOServiceMonitor {
    constructor({ url, interval, metricsClient, logger }) {
        this.socket = null;
        this.pingInterval = null;
        this.url = url;
        this.interval = interval;
        this.metricsClient = metricsClient;
        debugger;
        this.logger = logger;
    }
    connect() {
        this.socket = (0, socket_io_client_1.io)(this.url);
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
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
    startPinging() {
        this.pingInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            this.socket.emit("ping", () => __awaiter(this, void 0, void 0, function* () {
                const latency = Date.now() - startTime;
                Logger_1.Logger.log(`Latency to ${this.url}: ${latency} ms`);
                this.metricsClient.setLatency(this.url, latency);
                yield this.metricsClient.pushMetrics();
            }));
        }), this.interval);
    }
    stopPinging() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
    }
    isConnected() {
        var _a;
        return ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected) || false;
    }
}
exports.SocketIOServiceMonitor = SocketIOServiceMonitor;
