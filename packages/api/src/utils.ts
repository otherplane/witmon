import {
  EGG_BIRTH_DATE,
  EGG_COLORS_COUNT,
  INCUBATION_COOLDOWN,
  INCUBATION_DURATION,
} from './constants'
import { Incubation } from './types'

export function calculateRemainingCooldown(
  incubationEnds: number,
  currentTimestamp = Date.now(),
  incubationCooldown: number = INCUBATION_COOLDOWN
) {
  const remainingMillis = incubationEnds + incubationCooldown - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function calculateRemainingDuration(
  incubationEnds: number,
  currentTimestamp = Date.now(),
  incubationDuration: number = INCUBATION_DURATION
) {
  const remainingMillis = incubationEnds - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function getIncubationExtendedFromBase(incubation: Incubation) {
  return (
    incubation && {
      ...incubation,
      remainingCooldown: calculateRemainingCooldown(incubation.ends),
      remainingDuration: calculateRemainingDuration(incubation.ends),
    }
  )
}

export function getColorFromIndex(index: number) {
  return index % EGG_COLORS_COUNT
}

export function fromHexToUint8Array(hex: string) {
  return Uint8Array.from(Buffer.from(hex.substring(2).padStart(64, '0'), 'hex'))
}

export function isTimeToMint() {
  return Date.now() >= EGG_BIRTH_DATE
}
