import {
  PCFSoftShadowMap,
  Vector3
} from 'three'

/**
 * Vectors
 */
export const VECTOR_UP_Y = new Vector3(0, 1, 0)

/**
 * Colors
 */
export const COLOR_FOG = 0x3498db
export const COLOR_BLACK = 0x000000
export const COLOR_AMBIENT_LIGHT = 0xafe3f3

/**
 * Renderer
 */
export const SHADOWMAP = PCFSoftShadowMap
export const EXPOSURE = 1

/**
 * Camera
 */
export const FOV = 30.0
export const NEAR = 0.1
export const FAR = 100.0
export const FOG_NEAR = 50
export const FOG_FAR = 75

/**
 * Controls
 */
export const PASSIVE = { passive: true }
