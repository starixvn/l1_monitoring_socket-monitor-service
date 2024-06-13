"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
exports.default = {
    hostingPort: process.env,
    services: [
        { url: "minisedie", interval: 5000 },
        { url: "vipbaccarat", interval: 5000 },
    ],
    pushGatewayUrl: process.env.PUSH_GATEWAY,
    jobName: process.env.JOB_NAME,
    promPushGatewayConfigs: {
        baseUrl: process.env.PUSH_GATEWAY,
        options: {
            timeout: 5000,
            agentOptions: {
                keepAlive: true,
                keepAliveMsecs: 10000,
                maxSockets: 10,
            },
        },
        parameters: { jobName: process.env.JOB_NAME, groupings: { instance: (0, os_1.hostname)() } },
    },
};
