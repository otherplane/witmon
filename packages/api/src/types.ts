import { Static, Type } from '@sinclair/typebox'

export const ClaimEggParams = Type.Object({
  key: Type.String(),
})
export type ClaimEggParams = Static<typeof ClaimEggParams>

export const Egg = Type.Object({
  color: Type.Number(),
  index: Type.Number(),
  key: Type.String(),
  score: Type.Number(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
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
  color: Type.Number(),
  index: Type.Number(),
  rarityIndex: Type.Number(),
  score: Type.Number(),
  username: Type.Optional(Type.String()),
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

export const MintParams = Type.Object({
  address: Type.String(),
})
export type MintParams = Static<typeof MintParams>

export const MintOutput = Type.Object({
  envelopedSignature: Type.Object({
    message: Type.String(),
    messageHash: Type.Optional(Type.String()),
    signature: Type.String(),
  }),
  data: Type.Object({
    address: Type.String(),
    index: Type.Number(),
    rank: Type.Number(),
    score: Type.Number(),
    total: Type.Number(),
  }),
})
export type MintOutput = Static<typeof MintOutput>

export const EggMetadata = Type.Object({
  name: Type.String(),
  description: Type.String(),
  image_data: Type.String(),
  external_url: Type.String(),
  attributes: Type.Array(
    Type.Object({
      trait_type: Type.String(),
      value: Type.String(),
    })
  ),
})

export type EggMetadata = Static<typeof EggMetadata>
