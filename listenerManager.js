let listeners = [];

export function registerListener(unsubscribe) {
  listeners.push(unsubscribe);
}

export function clearListeners() {
  listeners.forEach(fn => fn());
  listeners = [];
}
