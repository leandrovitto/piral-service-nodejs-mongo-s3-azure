import { Pilet, PiletVersion } from '@prisma/client';

interface PiletVersionWithPilet extends PiletVersion {
  pilet: Pilet;
}

export { PiletVersionWithPilet };
