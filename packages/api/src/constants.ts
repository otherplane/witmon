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

// Egg incubation duration in millis
export const INCUBATION_DURATION = process.env.INCUBATION_DURATION
  ? parseInt(process.env.INCUBATION_DURATION)
  : 5 * 60 * 1000

// Egg incubation cooldown in millis
export const INCUBATION_COOLDOWN = process.env.INCUBATION_COOLDOWN
  ? parseInt(process.env.INCUBATION_COOLDOWN)
  : 2 * 60 * 60 * 1000

// Incubation points if target egg is your own
export const INCUBATION_POINTS_SELF = process.env.INCUBATION_POINTS_SELF
  ? parseInt(process.env.INCUBATION_POINTS_SELF)
  : 20

// Incubation points if target egg is not your own
export const INCUBATION_POINTS_OTHERS = process.env.INCUBATION_POINTS_OTHERS
  ? parseInt(process.env.INCUBATION_POINTS_OTHERS)
  : 100
