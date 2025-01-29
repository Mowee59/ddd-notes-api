import 'dotenv/config';
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  schema: './src/drizzle/schemas/*',
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_FILE,
  },
});
