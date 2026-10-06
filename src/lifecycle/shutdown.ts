import { closeQueues } from "../queue/lifecycle";
import { closeWorkers } from "../queue/worker";

type StoppableServer = {
  stop: () => void | Promise<void>;
};

export function registerShutdownHandlers(server: StoppableServer) {
  let isShuttingDown = false;

  async function shutdown(signal: NodeJS.Signals) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.info(`${signal} received; stopping API and queue services`);

    try {
      await server.stop();
      await closeWorkers();
      await closeQueues();
    } catch (error) {
      console.error("Error during application shutdown:", error);
      process.exitCode = 1;
    }
  }

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}
