import { Collection, Db } from 'mongodb'

import { Incubation } from '../types'

export class IncubationRepository {
  private collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('eggs')
  }

  public async create(incubation: Incubation): Promise<Incubation> {
    const success = await this.collection.insertOne(incubation)

    if (!success.acknowledged)
      throw new Error(`Incubation could not be created`)

    return incubation
  }

  public async getLast(
    search: { to: string } | { from: string }
  ): Promise<Incubation | null> {
    const incubation = await this.collection.findOne(search, {
      sort: { timestamp: -1 },
    })

    return incubation as Incubation
  }
}
