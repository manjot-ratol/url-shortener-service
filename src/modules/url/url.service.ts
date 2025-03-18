import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import * as crypto from 'crypto';
import { IUrl } from 'src/common/database/url.model';
import { UrlModelHelperService } from '../model-helper/url-model-helper.service';
import * as _ from 'lodash';

@Injectable()
export class UrlService {
  constructor(private readonly urlModelHelperService: UrlModelHelperService) {}

  async generateShortUrl(): Promise<string> {
    const randomBytes = crypto.randomBytes(8).toString('hex');
    return this.encodeBase62(randomBytes);
  }

  private encodeBase62(str: string): string {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const hex = BigInt('0x' + str);
    let encoded = '';
    
    let num = hex;
    while (num > 0) {
      encoded = charset[Number(num % 62n)] + encoded;
      num = num / 62n;
    }
    
    return encoded;
  }

  async create(createUrlDto: CreateUrlDto): Promise<IUrl> {
    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
      const shortUrl = await this.generateShortUrl();
      
      const url: IUrl = {
        longUrl: createUrlDto.longUrl,
        shortUrl,
      };
      console.log(`(create) shortUrl: ${shortUrl} :: url: ${JSON.stringify(url)}`);

      try {
        const urlFromDb = await this.urlModelHelperService.createUrl(url);
        console.log(`(create) new url added in db: ${JSON.stringify(urlFromDb)}`);
        return urlFromDb;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.shortUrl) {
          // Duplicate key error for shortUrl, retry with a new shortUrl
          console.log(`(create) duplicate shortUrl detected, retrying... (attempt ${retries + 1}/${maxRetries})`);
          retries++;
          continue;
        }
        throw error;
      }
    }
    
    throw new ConflictException('Failed to generate unique short URL after multiple attempts');
  }

  async findByShortUrl(shortUrl: string): Promise<String> {
    console.log(`(findByShortUrl) getting longUrl for shortUrl: ${shortUrl}`);
    const url = await this.urlModelHelperService.findUrlByShortUrl(shortUrl);
    console.log(`(findByShortUrl) url: ${JSON.stringify(url)}`);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url.longUrl;
  }
} 