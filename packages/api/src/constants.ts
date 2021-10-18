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

// Egg incubation duration in millis
export const INCUBATION_DURATION_MILLIS = process.env.INCUBATION_DURATION_MILLIS
  ? parseInt(process.env.INCUBATION_DURATION_MILLIS)
  : 2 * 60 * 1000

// Egg incubation cooldown in millis
export const INCUBATION_COOLDOWN_MILLIS = process.env.INCUBATION_COOLDOWN_MILLIS
  ? Math.max(
      parseInt(process.env.INCUBATION_COOLDOWN_MILLIS),
      INCUBATION_DURATION_MILLIS
    )
  : Math.max(2 * 60 * 60 * 1000, INCUBATION_DURATION_MILLIS)

// Incubation points
export const INCUBATION_POINTS = process.env.INCUBATION_POINTS
  ? parseInt(process.env.INCUBATION_POINTS)
  : 800

// Minimum amount of points that can be rewarded after an incubation
export const INCUBATION_POINTS_MIN = process.env.INCUBATION_POINTS_MIN
  ? parseInt(process.env.INCUBATION_POINTS_MIN)
  : 50

// Incubation point divisor to be applied every time the same incubation happens
export const INCUBATION_POINTS_DIVISOR = process.env.INCUBATION_POINTS_DIVISOR
  ? parseInt(process.env.INCUBATION_POINTS_DIVISOR)
  : 2

// Secp256k1 private key used for signing in the `mint` endpoint
export const MINT_PRIVATE_KEY =
  process.env.MINT_PRIVATE_KEY || '0x00'
  // '0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7'

// Tell how many eggs to generate
export const EGGS_COUNT: number = process.env.EGGS_COUNT
  ? parseInt(process.env.EGGS_COUNT)
  : 10

// Number of different egg colors
export const EGG_COLORS_COUNT = process.env.EGG_COLORS_COUNT
  ? parseInt(process.env.EGG_COLORS_COUNT)
  : 7

// Egg birth/hatch date in millis
// If `EGG_MINT_TIMESSTAMP=0`, checks are ignored (for testing purposes)
export const EGG_MINT_TIMESSTAMP = process.env.EGG_MINT_TIMESSTAMP
  ? parseInt(process.env.EGG_MINT_TIMESSTAMP)
  : 1634835600 // Thursday, October 21, 2021 17:00:00 PM (GMT)

// Web3 provider URL
export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'

// WitmonERC721 contract address
export const WITMON_ERC721_ADDRESS =
  process.env.WITMON_ERC721_ADDRESS ||
  '0xadE064924d365A90975cdfaD8515E44bC31402C0'

export const MONGO_URI: string = process.env.MONGO_URI || 'MONGO_URI=mongodb://your_username:your_password@localhost:27017/database'

export default {
  EGG_COLORS_COUNT,
  EGG_KEY_LENGTH_BYTES,
  EGG_MINT_TIMESSTAMP,
  EGGS_COUNT,
  INCUBATION_COOLDOWN_MILLIS,
  INCUBATION_DURATION_MILLIS,
  INCUBATION_POINTS,
  INCUBATION_POINTS_DIVISOR,
  INCUBATION_POINTS_MIN,
  MONGO_URI,
  WITMON_ERC721_ADDRESS,
}
