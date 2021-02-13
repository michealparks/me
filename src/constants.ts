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

/**
 * Physics
 */
export const MAX_BODIES = 100

// Rigid body has infinite mass and cannot move.
export const BODYTYPE_STATIC = 0

// Rigid body is simulated according to applied forces.
export const BODYTYPE_DYNAMIC = 1

// Rigid body has infinite mass and does not respond to forces but can still be moved by setting their velocity or position.
export const BODYTYPE_KINEMATIC = 2

// Collision shapes
export const BODYSHAPE_BOX = 0
export const BODYSHAPE_SPHERE = 1
export const BODYSHAPE_MESH = 2

// Collision flags
export const BODYFLAG_STATIC_OBJECT = 1
export const BODYFLAG_KINEMATIC_OBJECT = 2
export const BODYFLAG_NORESPONSE_OBJECT = 4

// Activation states
export const BODYSTATE_ACTIVE_TAG = 1
export const BODYSTATE_ISLAND_SLEEPING = 2
export const BODYSTATE_WANTS_DEACTIVATION = 3
export const BODYSTATE_DISABLE_DEACTIVATION = 4
export const BODYSTATE_DISABLE_SIMULATION = 5

// Groups
export const BODYGROUP_NONE = 0
export const BODYGROUP_DEFAULT = 1
export const BODYGROUP_DYNAMIC = 1
export const BODYGROUP_STATIC = 2
export const BODYGROUP_KINEMATIC = 4
export const BODYGROUP_ENGINE_1 = 8
export const BODYGROUP_TRIGGER = 16
export const BODYGROUP_ENGINE_2 = 32
export const BODYGROUP_ENGINE_3 = 64
export const BODYGROUP_USER_1 = 128
export const BODYGROUP_USER_2 = 256
export const BODYGROUP_USER_3 = 512
export const BODYGROUP_USER_4 = 1024
export const BODYGROUP_USER_5 = 2048
export const BODYGROUP_USER_6 = 4096
export const BODYGROUP_USER_7 = 8192
export const BODYGROUP_USER_8 = 16384

// Masks
export const BODYMASK_NONE = 0
export const BODYMASK_ALL = 65535
export const BODYMASK_STATIC = 2
export const BODYMASK_NOT_STATIC = 65535 ^ 2
export const BODYMASK_NOT_STATIC_KINEMATIC = 65535 ^ (2 | 4)

export const COLORS = {
  black: 0x000000,
  darkGray: 0x616161,
  lightGray: 0xbdbdbd,

  coolLight: 0xFFFFFF,
  warmLight: 0xFFF5b6,
  warmerLight: 0xEFC070,
  warmestLight: 0xE47025,

  lightBlue: 0x00b0ff,
  darkBlue: 0x01579b,
  yellow: 0xffee58,

  lightRed: 0xff5252,
  darkRed: 0xb71c1c,

  lightOrange: 0xffb74d,
  darkOrange: 0xef6c00,

  lightestPink: 0xffebee,
  salmon: 0xe57373,

  lightCyan: 0x80DEEA,
  darkCyan: 0x0097A7,

  lightIndigo: 0x5C6BC0,
  darkIndigo: 0x303F9F,

  white: 0xFFFFFF
}

export const SHADOW_MAP = {
  width: 2 ** 10,
  height: 2 ** 10
}