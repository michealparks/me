import {
  PCFSoftShadowMap,
  Vector3
} from "./_snowpack/pkg/three.js";
export const VECTOR_UP_Y = new Vector3(0, 1, 0);
export const COLOR_FOG = 3447003;
export const COLOR_BLACK = 0;
export const COLOR_AMBIENT_LIGHT = 11527155;
export const SHADOWMAP = PCFSoftShadowMap;
export const EXPOSURE = 1;
export const FOV = 30;
export const NEAR = 0.1;
export const FAR = 100;
export const FOG_NEAR = 50;
export const FOG_FAR = 75;
export const PASSIVE = {passive: true};
export const MAX_BODIES = 100;
export const BODYTYPE_STATIC = 0;
export const BODYTYPE_DYNAMIC = 1;
export const BODYTYPE_KINEMATIC = 2;
export const BODYSHAPE_BOX = 0;
export const BODYSHAPE_SPHERE = 1;
export const BODYSHAPE_MESH = 2;
export const BODYFLAG_STATIC_OBJECT = 1;
export const BODYFLAG_KINEMATIC_OBJECT = 2;
export const BODYFLAG_NORESPONSE_OBJECT = 4;
export const BODYSTATE_ACTIVE_TAG = 1;
export const BODYSTATE_ISLAND_SLEEPING = 2;
export const BODYSTATE_WANTS_DEACTIVATION = 3;
export const BODYSTATE_DISABLE_DEACTIVATION = 4;
export const BODYSTATE_DISABLE_SIMULATION = 5;
export const BODYGROUP_NONE = 0;
export const BODYGROUP_DEFAULT = 1;
export const BODYGROUP_DYNAMIC = 1;
export const BODYGROUP_STATIC = 2;
export const BODYGROUP_KINEMATIC = 4;
export const BODYGROUP_ENGINE_1 = 8;
export const BODYGROUP_TRIGGER = 16;
export const BODYGROUP_ENGINE_2 = 32;
export const BODYGROUP_ENGINE_3 = 64;
export const BODYGROUP_USER_1 = 128;
export const BODYGROUP_USER_2 = 256;
export const BODYGROUP_USER_3 = 512;
export const BODYGROUP_USER_4 = 1024;
export const BODYGROUP_USER_5 = 2048;
export const BODYGROUP_USER_6 = 4096;
export const BODYGROUP_USER_7 = 8192;
export const BODYGROUP_USER_8 = 16384;
export const BODYMASK_NONE = 0;
export const BODYMASK_ALL = 65535;
export const BODYMASK_STATIC = 2;
export const BODYMASK_NOT_STATIC = 65535 ^ 2;
export const BODYMASK_NOT_STATIC_KINEMATIC = 65535 ^ (2 | 4);
export const COLORS = {
  black: 0,
  darkGray: 6381921,
  lightGray: 12434877,
  coolLight: 16777215,
  warmLight: 16774582,
  warmerLight: 15712368,
  warmestLight: 14970917,
  lightBlue: 45311,
  darkBlue: 87963,
  yellow: 16772696,
  lightRed: 16732754,
  darkRed: 12000284,
  lightOrange: 16758605,
  darkOrange: 15690752,
  lightestPink: 16772078,
  salmon: 15037299,
  lightCyan: 8445674,
  darkCyan: 38823,
  lightIndigo: 6056896,
  darkIndigo: 3162015,
  white: 16777215
};
export const SHADOW_MAP = {
  width: 2 ** 10,
  height: 2 ** 10
};
