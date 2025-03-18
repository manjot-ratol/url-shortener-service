import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { UrlModelHelperService } from './url-model-helper.service';

@Module({
  imports: [DatabaseModule],
  providers: [UrlModelHelperService],
  exports: [UrlModelHelperService]
})
export class UrlModelHelperModule {}
