export default {
    hostingPort: 5000,
    services: [
        { url: "minisedie", interval: 5000 },
        { url: "vipbaccarat", interval: 5000 },
    ],
    pushGatewayUrl: "http://your-push-gateway-url",
    jobName: "socket_io_monitor",
};
