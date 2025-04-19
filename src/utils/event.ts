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
}

const EventMessage = ["BAD_REQUEST"] as const;
const event = new AppEvent();
export default event;
