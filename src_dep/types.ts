export type Listener = {
  (): void
}

export type Tick = {
  (dt: number, elapsed: number): void
}
