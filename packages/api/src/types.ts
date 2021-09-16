import { Static, Type } from '@sinclair/typebox'

export const EggInput = Type.Object({
  username: Type.String(),
  key: Type.String()
})
export type EggInput = Static<typeof EggInput>

export const Egg = Type.Object({
  username: Type.String(),
  key: Type.String(),
  score: Type.Number(),
  lastTimeImproved: Type.Number(),
  improvedBy: Type.Array(
    Type.Object({
      key: Type.String(),
      timestamp: Type.Number()
    })
  )
})
export type Egg = Static<typeof Egg>

export const ListEggsQueryString = Type.Object({
  keys: Type.Optional(Type.Array(Type.String()))
})
export type ListEggsQueryString = Static<typeof ListEggsQueryString>

export const GetByKeyParams = Type.Object({
  key: Type.String()
})
export type GetByKeyParams = Static<typeof GetByKeyParams>

export const ImproveInput = Type.Object({
  incubated: Type.String(),
  incubator: Type.String()
})
export type ImproveInput = Static<typeof ImproveInput>
