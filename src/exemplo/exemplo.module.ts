import { Module } from '@nestjs/common';
import { ExemploService } from './exemplo.service';
import { ExemploController } from './exemplo.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ExemploController],
  providers: [ExemploService],
})
export class ExemploModule {}
