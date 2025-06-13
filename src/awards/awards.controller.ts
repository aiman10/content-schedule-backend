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
import { AwardsService } from './awards.service';

@Controller('awards')
export class AwardsController {
  constructor(private service: AwardsService) {}

  @Options()
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  public options() {
    return {};
  }

  @Get()
  public getAwards() {
    return this.service.getAwards();
  }
}
