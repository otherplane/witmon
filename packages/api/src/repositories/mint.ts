import { Collection, Db } from 'mongodb'

import { MintOutput } from '../types'

export class MintRepository {
  private collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('mints')
  }

  public async create(mintOutput: MintOutput): Promise<MintOutput> {
    const success = await this.collection.insertOne(MintOutput)

    if (!success.acknowledged)
      throw new Error(`Incubation could not be created`)

    return mintOutput
  }

  public async get(key: string): Promise<MintOutput | null> {
    return ((await this.collection.findOne({ key })) as MintOutput) || null
  }
}
