import { hostname } from "os";

export default {
    hostingPort: 5000,
    services: [
        { url: "minisedie", interval: 5000 },
        { url: "vipbaccarat", interval: 5000 },
    ],
    pushGatewayUrl: "http://your-push-gateway-url",
    jobName: "socket_io_monitor",
    promPushGatewayConfigs: {
        baseUrl: "http://admin:17NyV+Weaatx_86gBSKc@10.10.50.69:9091",
        options: {
            timeout: 5_000,
            agentOptions: {
                keepAlive: true,
                keepAliveMsecs: 10_000,
                maxSockets: 10,
            },
        },
        parameters: { jobName: "socket-monitoring-service", groupings: { instance: hostname() } },
    },
};
