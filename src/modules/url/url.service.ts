import { Injectable, NotFoundException } from '@nestjs/common';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  private urls: Map<string, Url> = new Map();

  generateShortUrl(): string {
    let shortUrl: string;
    do {
      const randomBytes = crypto.randomBytes(8).toString('hex');
      shortUrl = this.encodeBase62(randomBytes);
    } while (this.urls.has(shortUrl));
    return shortUrl;
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

  create(createUrlDto: CreateUrlDto): Url {
    const shortUrl = this.generateShortUrl();
    
    const url: Url = {
      longUrl: createUrlDto.longUrl,
      shortUrl,
      createdAt: new Date(),
    };
    console.log(`(create) shortUrl: ${shortUrl}, url: ${JSON.stringify(url)}`);

    this.urls.set(shortUrl, url);
    console.log(`(create) urls after adding new url:`, Object.fromEntries(this.urls));
    return url;
  }

  findByShortUrl(shortUrl: string): Url {
    console.log(`(findByShortUrl) getting longUrl for shortUrl: ${shortUrl}`);
    const url = this.urls.get(shortUrl);
    console.log(`(findByShortUrl) urls:`, Object.fromEntries(this.urls));
    console.log(`(findByShortUrl) url: ${JSON.stringify(url)}`);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    //url.clicks++;
    return url;
  }
} 