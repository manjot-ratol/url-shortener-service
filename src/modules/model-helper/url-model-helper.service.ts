import { Injectable, Inject } from '@nestjs/common';
import { URL_MODEL } from 'src/common/database/database.contants';
import { IUrl } from 'src/common/database/url.model';
import { Model } from 'mongoose';

@Injectable()
export class UrlModelHelperService {
  constructor(
    @Inject(URL_MODEL) private readonly urlModel: Model<IUrl>
  ) {}  

  async createUrl(url: IUrl) {
    return this.urlModel.create(url);
  }

  async findUrlByShortUrl(shortUrl: string) {
    return this.urlModel.findOne({ shortUrl });
  }
}