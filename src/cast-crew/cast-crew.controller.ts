import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Options,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CastCrewService } from './cast-crew.service';

@Controller('cast-crew')
export class CastCrewController {
  constructor(private service: CastCrewService) {}

  @Options()
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  public options() {
    return {};
  }

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
