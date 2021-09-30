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
  // lastTimeImproved: Type.Number(),
  // improvedBy: Type.Array(
  //   Type.Object({
  //     key: Type.String(),
  //     timestamp: Type.Number()
  //   })
  // )
})
export type Egg = Static<typeof Egg>

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
})
export type EggProtected = Static<typeof EggProtected>

export const ImproveParams = Type.Object({
  target: Type.String(),
})
export type ImproveParams = Static<typeof ImproveParams>

export const Incubation = Type.Object({
  to: Type.String(),
  from: Type.String(),
  timestamp: Type.Number(),
  duration: Type.Number(),
  points: Type.Number(),
})
export type Incubation = Static<typeof Incubation>
