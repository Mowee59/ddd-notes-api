import 'dotenv/config';
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  schema: './src/drizzle/schemas/*',
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_FILE,
  },
  // Migrations files location
  out: './database/migrations',
});
