import * as crypto from 'crypto';
import prisma from '../helpers/prisma-client';

const truncateDB = async () => {
  const tables = ['Keys', 'PiletVersion', 'Pilet', 'User'];

  return tables.map(async (table) => {
    await prisma.$queryRawUnsafe(
      `Truncate "${table}" restart identity cascade;`,
    );
  });
};

export const clearData = async () => {
  const deletePiletVersions = prisma.piletVersion.deleteMany();
  const deletePilet = prisma.pilet.deleteMany();
  const deleteKeys = prisma.keys.deleteMany();

  return await prisma.$transaction([
    deletePiletVersions,
    deletePilet,
    deleteKeys,
  ]);
};

const generateKey = () =>
  crypto
    .createHash('sha256')
    .update(Math.random().toString())
    .digest()
    .toString('hex');

export { generateKey, truncateDB };
