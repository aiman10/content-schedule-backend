import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, Document, MongoClient } from 'mongodb';

/**
 * Owns a single shared MongoClient for the whole app.
 *
 * The connection string (which includes credentials) is read from the
 * MONGODB_URI environment variable. It must never be hard-coded in source.
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly client: MongoClient;
  private readonly dbName: string;

  constructor(config: ConfigService) {
    const uri = config.get<string>('MONGODB_URI');
    if (!uri) {
      throw new Error(
        'MONGODB_URI is not set. Provide the MongoDB connection string via environment variable.',
      );
    }
    this.dbName = config.get<string>('MONGODB_DB') ?? 'ContentCalender';
    this.client = new MongoClient(uri);
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  db(): Db {
    return this.client.db(this.dbName);
  }

  collection<T extends Document = Document>(name: string): Collection<T> {
    return this.db().collection<T>(name);
  }
}
