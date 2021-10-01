import { INCUBATION_COOLDOWN, INCUBATION_DURATION } from './constants'
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
