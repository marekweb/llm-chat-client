export class EventEmitter<T> {
  private listeners = new Set<(value: T) => void>();

  emit(value: T) {
    this.listeners.forEach((listener) => listener(value));
  }

  addEventListener(listener: (value: T) => void) {
    this.listeners.add(listener);
  }

  removeEventListener(listener: (value: T) => void) {
    this.listeners.delete(listener);
  }
}
