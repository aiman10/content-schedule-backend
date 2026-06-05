import { Injectable } from '@nestjs/common';
import { Award } from 'src/type';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AwardsService {
  constructor(private readonly db: DatabaseService) {}

  public async getAwards() {
    return this.db.collection<Award>('awards').find({}).toArray();
  }
}
