import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlModelHelperModule } from '../model-helper/url-model-helper.module';

@Module({
  imports: [UrlModelHelperModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {} 