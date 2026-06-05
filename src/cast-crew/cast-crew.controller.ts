import { Controller, Get } from '@nestjs/common';
import { CastCrewService } from './cast-crew.service';

@Controller('cast-crew')
export class CastCrewController {
  constructor(private service: CastCrewService) {}

  @Get('/actors')
  public async getAllActors() {
    return this.service.getAllActors();
  }

  @Get('/actresses')
  public async getAllActresses() {
    return this.service.getAllActresses();
  }

  @Get('/directors')
  public async getAllDirectors() {
    return this.service.getAllDirectors();
  }

  @Get('/composers')
  public async getAllComposers() {
    return this.service.getAllComposers();
  }
}
