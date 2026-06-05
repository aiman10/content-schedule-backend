import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CastCrewService {
  constructor(private readonly db: DatabaseService) {}

  //get actors from db
  public async getAllActors() {
    return this.db.collection('actors').find({}).toArray();
  }

  //get actresses from db
  public async getAllActresses() {
    return this.db.collection('actresses').find({}).toArray();
  }

  //get directors from db
  public async getAllDirectors() {
    return this.db.collection('directors').find({}).toArray();
  }

  //get composers from db
  public async getAllComposers() {
    return this.db.collection('composers').find({}).toArray();
  }
}
