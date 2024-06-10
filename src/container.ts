import { createContainer, asClass, asValue } from "awilix";
import { PrometheusClient } from "./utils/PrometheusClient";
import { SocketIOServiceMonitor } from "./services/SocketIOServiceMonitor";
import { Logger } from "./utils/Logger";

import AppConfig from "./AppConfig";

const container = createContainer();

container.register({
    config: asValue(AppConfig),
    logger: asValue(Logger),
    prometheusClient: asClass(PrometheusClient).singleton(),
    socketIOServiceMonitor: asClass(SocketIOServiceMonitor),
});

export default container;
