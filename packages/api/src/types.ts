import { Static, Type } from '@sinclair/typebox'

export const ClaimEggParams = Type.Object({
  key: Type.String(),
})
export type ClaimEggParams = Static<typeof ClaimEggParams>

export const Egg = Type.Object({
  key: Type.String(),
  username: Type.String(),
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

export const ListEggsQueryString = Type.Object({
  keys: Type.Optional(Type.Array(Type.String())),
})
export type ListEggsQueryString = Static<typeof ListEggsQueryString>

export const AuthorizationHeader = Type.Object({
  Authorization: Type.String(),
})
export type AuthorizationHeader = Static<typeof AuthorizationHeader>

export const GetByKeyParams = Type.Object({
  key: Type.String(),
})
export type GetByKeyParams = Static<typeof GetByKeyParams>

export const ImproveInput = Type.Object({
  incubated: Type.String(),
  incubator: Type.String(),
})
export type ImproveInput = Static<typeof ImproveInput>

export const JwtVerifyPayload = Type.Object({
  id: Type.String(),
  iat: Type.Number(),
})
export type JwtVerifyPayload = Static<typeof JwtVerifyPayload>
