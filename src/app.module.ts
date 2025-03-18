import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './modules/url/url.module';
import { DatabaseModule } from './common/database/database.module';
import { UrlModelHelperModule } from './modules/model-helper/url-model-helper.module';
import { config } from './common/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UrlModule,
    DatabaseModule,
    UrlModelHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
