import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './modules/url/url.module';
import { DatabaseModule } from './common/database/database.module';
import { UrlModelHelperModule } from './modules/model-helper/url-model-helper.module';

@Module({
  imports: [
    UrlModule,
    DatabaseModule,
    UrlModelHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
