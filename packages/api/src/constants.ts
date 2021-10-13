/**
 * Constants. These can be customized through environment variables.
 */

// Byte length of egg keys. This can be adjusted for usability vs. security trade-offs.
let eggKeyLengthBytes: number = process.env.EGG_KEY_LENGTH_BYTES
  ? parseInt(process.env.EGG_KEY_LENGTH_BYTES)
  : 8
// Ensure that egg keys byte length is 8 <= x < 30
if (eggKeyLengthBytes < 8 || eggKeyLengthBytes > 30) {
  eggKeyLengthBytes = 8
}
export const EGG_KEY_LENGTH_BYTES = eggKeyLengthBytes

// Base string to use for salting the deterministic egg key derivation.
export const EGG_KEY_SALT: string = process.env.EGG_KEY_SALT || ''

// JWT secret to derive tokens
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'

// Egg incubation duration in milliss
export const INCUBATION_DURATION_MILLIS = process.env
  .INCUBATION_DURATION_SECONDS
  ? parseInt(process.env.INCUBATION_DURATION_SECONDS) * 1000
  : 5 * 60 * 1000

// Egg incubation cooldown in seconds
export const INCUBATION_COOLDOWN_MILLIS = process.env
  .INCUBATION_COOLDOWN_SECONDS
  ? Math.max(
      parseInt(process.env.INCUBATION_COOLDOWN_SECONDS) * 1000,
      INCUBATION_DURATION_MILLIS
    )
  : Math.max(2 * 60 * 60 * 1000, INCUBATION_DURATION_MILLIS)

// Incubation points
export const INCUBATION_POINTS = process.env.INCUBATION_POINTS
  ? parseInt(process.env.INCUBATION_POINTS)
  : 800

// Minimum amount of points that can be incubated
export const INCUBATION_POINTS_MIN = process.env.INCUBATION_POINTS_MIN
  ? parseInt(process.env.INCUBATION_POINTS_MIN)
  : 50

// Incubation factor to be
export const INCUBATION_POINTS_DIVISOR = process.env.INCUBATION_POINTS_DIVISOR
  ? parseInt(process.env.INCUBATION_POINTS_DIVISOR)
  : 2

// Secp256k1 private key used for signing in the `mint` endpoint
export const MINT_PRIVATE_KEY =
  process.env.MINT_PRIVATE_KEY ||
  '0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7'

// Number of different egg colors
export const EGG_COLORS_COUNT = process.env.EGG_COLORS_COUNT
  ? parseInt(process.env.EGG_COLORS_COUNT)
  : 7

// Egg birth/hatch date in millis
// If `EGG_BIRTH_DATE=0`, checks are ignored (for testing purposes)
export const EGG_MINT_TIMESSTAMP = process.env.EGG_BIRTH_DATE
  ? parseInt(process.env.EGG_BIRTH_DATE)
  : 1635116400 // Sunday, October 24, 2021 11:00:00 PM (GMT)
