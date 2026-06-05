import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Global so every feature module shares the one MongoClient
 * instead of each service opening its own connection pool.
 */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
