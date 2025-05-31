class AppEvent {
  private eventMap: Map<
    (typeof EventMessage)[number],
    ((...args: any[]) => void)[]
  >;

  constructor() {
    this.eventMap = new Map();
  }

  on(
    eventName: (typeof EventMessage)[number],
    callback: (...args: any[]) => void
  ) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, []);
    }
    this.eventMap.get(eventName)?.push(callback);
  }

  emit(eventName: (typeof EventMessage)[number], ...args: any[]) {
    const callbacks = this.eventMap.get(eventName);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(...args);
      });
    }
  }
  off(
    eventName: (typeof EventMessage)[number],
    callback: (...args: any[]) => void
  ) {
    const callbacks = this.eventMap.get(eventName);
    if (callbacks) {
      this.eventMap.set(
        eventName,
        callbacks.filter((cb) => cb !== callback)
      );
    }
  }
}

const EventMessage = ["BAD_REQUEST", "SAND_PACK"] as const;
const event = new AppEvent();
export default event;
