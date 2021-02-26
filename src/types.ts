export type Listener = {
  (): void
}

export type Tick = {
  (dt: number, elapsed: number): void
}

export type Rigidbody = {
  id: number
  name: string
  type: number
  shape: number
  transform: Float32Array
  mass?: number
  linearDamping?: number
  angularDamping?: number
  friction: number
  restitution: number
  triangles?: Float32Array
  linkedRigidbodyId?: number
}
