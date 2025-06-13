import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

const url =
  'mongodb+srv://Admin:admin@webframeworkscluster.0dkna9w.mongodb.net/test';

@Injectable()
export class CastCrewService {
  private client = new MongoClient(url);

  constructor() {}

  onModuleInit() {
    this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }

  //get actors from db
  public async getAllActors() {
    let actor = await this.client
      .db('ContentCalender')
      .collection('actors')
      .find({})
      .toArray();
    return actor;
  }
  //get actresses from db
  public async getAllActresses() {
    let actress = await this.client
      .db('ContentCalender')
      .collection('actresses')
      .find({})
      .toArray();
    return actress;
  }

  //get directors from db
  public async getAllDirectors() {
    let director = await this.client
      .db('ContentCalender')
      .collection('directors')
      .find({})
      .toArray();
    return director;
  }

  //get composers from db
  public async getAllComposers() {
    let composer = await this.client
      .db('ContentCalender')
      .collection('composers')
      .find({})
      .toArray();
    return composer;
  }
}
