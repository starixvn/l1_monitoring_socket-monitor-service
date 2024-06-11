import { hostname } from "os";

export default {
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
            timeout: 5_000,
            agentOptions: {
                keepAlive: true,
                keepAliveMsecs: 10_000,
                maxSockets: 10,
            },
        },
        parameters: { jobName: process.env.JOB_NAME, groupings: { instance: hostname() } },
    },
};
