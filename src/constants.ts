import { Vector3 } from 'three'

/**
 * Vectors
 */
export const VECTOR_UP_Y = new Vector3(0, 1, 0)

/**
 * Colors
 */
export const COLOR_FOG = 0x34_98_DB
export const COLOR_BLACK = 0x00_00_00
export const COLOR_AMBIENT_LIGHT = 0xAF_E3_F3

/**
 * Renderer
 */

export const EXPOSURE = 1

/**
 * Camera
 */
export const FOV = 30
export const NEAR = 0.1
export const FAR = 100
export const FOG_NEAR = 50
export const FOG_FAR = 75

/**
 * Controls
 */
export const PASSIVE = { passive: true }

/**
 * Physics
 */

export const MAX_SUBSTEPS = 40
export const FIXED_TIMESTEP = 1 / 60
export const GRAVITY = -9.8
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
export const BODYGROUP_USER_8 = 16_384

// Masks
export const BODYMASK_NONE = 0
export const BODYMASK_ALL = 65_535
export const BODYMASK_STATIC = 2
export const BODYMASK_NOT_STATIC = 65_535 ^ 2
export const BODYMASK_NOT_STATIC_KINEMATIC = 65_535 ^ (2 | 4)

export const COLORS = {
  black: 0x00_00_00,
  darkGray: 0x61_61_61,
  lightGray: 0xBD_BD_BD,

  coolLight: 0xFF_FF_FF,
  warmLight: 0xFF_F5_B6,
  warmerLight: 0xEF_C0_70,
  warmestLight: 0xE4_70_25,

  lightBlue: 0x00_B0_FF,
  darkBlue: 0x01_57_9B,
  yellow: 0xFF_EE_58,

  lightRed: 0xFF_52_52,
  darkRed: 0xB7_1C_1C,

  lightOrange: 0xFF_B7_4D,
  darkOrange: 0xEF_6C_00,

  lightestPink: 0xFF_EB_EE,
  salmon: 0xE5_73_73,

  lightCyan: 0x80_DE_EA,
  darkCyan: 0x00_97_A7,

  lightIndigo: 0x5C_6B_C0,
  darkIndigo: 0x30_3F_9F,

  white: 0xFF_FF_FF,
}

export const SHADOW_MAP = {
  width: 2 ** 10,
  height: 2 ** 10,
}
export { PCFSoftShadowMap as SHADOWMAP } from 'three'
