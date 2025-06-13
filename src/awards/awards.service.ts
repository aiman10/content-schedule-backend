import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { Award } from 'src/type';
import { ObjectId } from 'mongodb';

const url =
  'mongodb+srv://Admin:admin@webframeworkscluster.0dkna9w.mongodb.net/test';

@Injectable()
export class AwardsService {
  private client = new MongoClient(url);

  constructor() {}

  onModuleInit() {
    this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }

  public async getAwards() {
    let awards = await this.client
      .db('ContentCalender')
      .collection('awards')
      .find<Award>({})
      .toArray();
    return awards;
  }
}
