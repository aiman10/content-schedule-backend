import { Controller, Get } from '@nestjs/common';
import { AwardsService } from './awards.service';

@Controller('awards')
export class AwardsController {
  constructor(private service: AwardsService) {}

  @Get()
  public getAwards() {
    return this.service.getAwards();
  }
}
