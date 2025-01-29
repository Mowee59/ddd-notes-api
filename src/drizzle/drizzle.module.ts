import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as schema from './schemas';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
export const DRIZZLE = Symbol('drizzle_connection');

@Module(
  {
    imports: [ConfigModule.forRoot()],
    providers: [
      {
        provide: DRIZZLE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
      const dbFile = configService.get('DATABASE_FILE');
      const client = createClient({ url: dbFile });
      return drizzle(client, { schema, casing: 'snake_case' }) as LibSQLDatabase<typeof schema>;
    }
  }
],
  exports: [DRIZZLE]
})
export class DrizzleModule {
}