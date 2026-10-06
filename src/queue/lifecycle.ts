type ClosableQueue = {
  close: () => Promise<void>;
};

const queues = new Set<ClosableQueue>();

export function registerQueue<T extends ClosableQueue>(queue: T): T {
  queues.add(queue);
  return queue;
}

export async function closeQueues() {
  await Promise.all([...queues].map((queue) => queue.close()));
}
