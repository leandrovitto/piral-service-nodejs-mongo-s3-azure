/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const generateKey = () =>
  crypto
    .createHash('sha256')
    .update(Math.random().toString())
    .digest()
    .toString('hex');

async function main() {
  await prisma.keys.deleteMany({ where: { id: { gte: 0 } } });
  for (let index = 0; index < 10; index++) {
    await prisma.keys.create({
      data: {
        key: generateKey(),
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
