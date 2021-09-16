import { Collection, Db } from 'mongodb'

import { Egg } from '../types'

export class EggRepository {
  private collection: Collection

  constructor (db: Db) {
    this.collection = db.collection('eggs')
  }

  public async create (egg: Egg): Promise<Egg> {
    const isAlreadyCreated = await this.get(egg.key)

    if (isAlreadyCreated) {
      throw new Error(`Egg with key ${egg.key} already exists`)
    }

    await this.collection.insertOne(egg)

    return egg
  }

  public improve (incubatedKey: string, incubatorKey: string) {
    this.collection.updateOne(
      { incubatedKey },
      {
        $push: { improvedBy: { key: incubatorKey, timestamp: Date.now() } },
        lastTimeImproved: Date.now()
      }
    )
  }

  public async list (keys?: Array<string>): Promise<Array<Egg>> {
    const documents = keys
      ? await this.collection.find({ key: { $in: keys } })
      : await this.collection.find()

    return (await documents.toArray()).map(document => ({
      key: document.key,
      score: document.score,
      username: document.username,
      improvedBy: document.improvedBy,
      lastTimeImproved: document.lastTimeImproved
    }))
  }

  public async get (key: string): Promise<Egg | null> {
    const egg = await this.collection.findOne({ key })
    if (egg) {
      return {
        key: egg.key,
        score: egg.score,
        username: egg.username,
        improvedBy: egg.improvedBy,
        lastTimeImproved: egg.lastTimeImproved
      }
    } else {
      return null
    }
  }
}
