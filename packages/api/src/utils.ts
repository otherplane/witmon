import { INCUBATION_COOLDOWN, INCUBATION_DURATION } from './constants'
import { Incubation } from './types'

export function calculateRemainingCooldown(
  incubationEnds: number,
  currentTimestamp = Date.now(),
  incubationCooldown: number = INCUBATION_COOLDOWN
) {
  return (currentTimestamp - incubationEnds - incubationCooldown) / (1000 * 60)
}

export function calculateRemainingDuration(
  incubationEnds: number,
  currentTimestamp = Date.now(),
  incubationDuration: number = INCUBATION_DURATION
) {
  return (currentTimestamp - incubationEnds - incubationDuration) / (1000 * 60)
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
