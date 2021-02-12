const events = new Map();
const on = (name, listener) => {
  if (events.has(name) === false) {
    events.set(name, new Set());
  }
  events.get(name).add(listener);
};
const fire = (name, data) => {
  if (events.has(name) === false) {
    return;
  }
  for (const listener of events.get(name)) {
    listener(data);
  }
};
const off = (name, listener) => {
  events.get(name).delete(listener);
};
const once = (name, listener) => {
  const wrappedListener = (data) => {
    listener(data);
    off(name, wrappedListener);
  };
  on(name, wrappedListener);
};
export const app = {
  on,
  once,
  fire,
  off
};
