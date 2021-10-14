import { Collection, Db } from 'mongodb'

import { EggMetadata } from '../types'

export class MetadataRepository {
  private collection: Collection

  constructor(db: Db) {
    this.collection = db.collection('metadata')
  }

  public async create(metadataOutput: EggMetadata): Promise<EggMetadata> {
    const success = await this.collection.insertOne(metadataOutput)

    if (!success.acknowledged)
      throw new Error(`Metadata object could not be created`)

    return metadataOutput
  }

  public async get(tokenId: number): Promise<EggMetadata | null> {
    return (
      ((await this.collection.findOne({ token_id: tokenId })) as EggMetadata) ||
      null
    )
  }
}
