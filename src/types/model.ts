import { Pilet, PiletVersion } from '@prisma/client';

type PiletVersionWithPilet = PiletVersion & { pilet: Pilet };

export { PiletVersionWithPilet };
