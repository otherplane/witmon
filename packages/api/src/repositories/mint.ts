import { Collection, Db } from 'mongodb'

import { MintOutput } from '../types'

export class MintRepository {
  private collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('mints')
  }

  public async create(mintOutput: MintOutput): Promise<MintOutput> {
    const success = await this.collection.insertOne(mintOutput)

    if (!success.acknowledged)
      throw new Error(`Mint object could not be created`)

    return mintOutput
  }

  public async get(index: number): Promise<MintOutput | null> {
    return ((await this.collection.findOne({ "data.index": index })) as MintOutput) || null
  }
}
