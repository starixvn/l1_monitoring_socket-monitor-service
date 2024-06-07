"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    hostingPort: 5000,
    services: [
        { url: "http://localhost:3000", interval: 5000 },
        { url: "http://localhost:4000", interval: 5000 },
    ],
    pushGatewayUrl: "http://your-push-gateway-url",
    jobName: "socket_io_monitor",
};
