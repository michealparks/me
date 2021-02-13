const events = new Map<string, any>()

const on = (name: string, listener: any) => {
  if (events.has(name) === false) {
    events.set(name, new Set())
  }

  events.get(name).add(listener)
}

const fire = (name: string, data: any) => {
  if (events.has(name) === false) {
    return
  }

  for (const listener of events.get(name)) {
    listener(data)
  }
}

const off = (name: string, listener: any) => {
  events.get(name).delete(listener)
}

const once = (name: string, listener: any) => {
  const wrappedListener = (data: any) => {
    listener(data)
    off(name, wrappedListener)
  }

  on(name, wrappedListener)
}

export const app = {
  on,
  once,
  fire,
  off
}
