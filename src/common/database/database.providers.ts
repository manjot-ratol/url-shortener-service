import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { urlSchema } from './url.model';
import { URL_MODEL } from './database.contants';
import { ConfigService } from '@nestjs/config';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      const uri = configService.get('databaseUri');
      console.log(`(databaseProviders) uri: ${uri}`);
      try {
        const connection = await mongoose.connect(uri, {
          // MongoDB connection options
          retryWrites: true,
          w: 'majority',
        });
        
        // Sync indexes for all models
        await connection.syncIndexes();
        
        console.log('Successfully connected to MongoDB.');
        return connection;
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    },
    inject: [ConfigService],
  },
  {
    provide: URL_MODEL,
    useFactory: (connection: Connection) => connection.model('Url', urlSchema, 'url'),
    inject: ['DATABASE_CONNECTION'],
  },
];
