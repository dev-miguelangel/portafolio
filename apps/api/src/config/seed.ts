/**
 * Seed script — creates the admin user if it doesn't exist.
 * Run: npx ts-node -r tsconfig-paths/register src/config/seed.ts
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'portafolio',
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await ds.initialize();

  const email = process.env.ADMIN_EMAIL ?? 'admin@miguelangeljaimen.cl';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_PASSWORD env variable is required for seeding');
  }

  const userRepo = ds.getRepository('users');
  const existing = await userRepo.findOne({ where: { email } });

  if (existing) {
    console.log(`Admin user already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await userRepo.save({ email, passwordHash });
    console.log(`Admin user created: ${email}`);
  }

  await ds.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
