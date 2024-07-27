import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExemploModule } from './exemplo/exemplo.module';

@Module({
  imports: [AuthModule, ExemploModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
