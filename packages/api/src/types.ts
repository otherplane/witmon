import { Static, Type } from '@sinclair/typebox'

export const ClaimEggParams = Type.Object({
  key: Type.String(),
})
export type ClaimEggParams = Static<typeof ClaimEggParams>

export const Egg = Type.Object({
  key: Type.String(),
  index: Type.Number(),
  username: Type.Optional(Type.String()),
  token: Type.Optional(Type.String()),
  score: Type.Number(),
})
export type Egg = Static<typeof Egg>

export const IndexedEgg = Type.Intersect([
  Egg,
  Type.Object({ rarityIndex: Type.Number() }),
])
export type IndexedEgg = Static<typeof IndexedEgg>

export const AuthorizationHeader = Type.Object({
  Authorization: Type.String(),
})
export type AuthorizationHeader = Static<typeof AuthorizationHeader>

export const GetByKeyParams = Type.Object({
  key: Type.String(),
})
export type GetByKeyParams = Static<typeof GetByKeyParams>

export const JwtVerifyPayload = Type.Object({
  id: Type.String(),
  iat: Type.Number(),
})
export type JwtVerifyPayload = Static<typeof JwtVerifyPayload>

export const EggProtected = Type.Object({
  index: Type.Number(),
  username: Type.Optional(Type.String()),
  score: Type.Number(),
  rarityIndex: Type.Number(),
})
export type EggProtected = Static<typeof EggProtected>

export const IncubateParams = Type.Object({
  target: Type.String(),
})
export type IncubateParams = Static<typeof IncubateParams>

export const Incubation = Type.Object({
  to: Type.String(),
  from: Type.String(),
  timestamp: Type.Number(),
  ends: Type.Number(),
  points: Type.Number(),
})
export type Incubation = Static<typeof Incubation>

export const ExtendedIncubation = Type.Object({
  to: Type.String(),
  from: Type.String(),
  timestamp: Type.Number(),
  ends: Type.Number(),
  points: Type.Number(),
  remainingDuration: Type.Number(),
  remainingCooldown: Type.Number(),
})
export type ExtendedIncubation = Static<typeof ExtendedIncubation>

export const ExtendedEgg = Type.Object({
  egg: IndexedEgg,
  incubatedBy: Type.Optional(ExtendedIncubation),
  incubating: Type.Optional(ExtendedIncubation),
})

export type ExtendedEgg = Static<typeof ExtendedEgg>
