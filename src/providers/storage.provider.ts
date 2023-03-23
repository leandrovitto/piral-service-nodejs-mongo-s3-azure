import { storage } from '../setting';
import { PiletVersionWithPilet } from '../types/model';
import awsStorageProvider from './awsStorage.provider';
import azureStorageProvider from './azureStorage.provider';
import localStorageProvider from './localStorage.provider';

/* eslint-disable @typescript-eslint/ban-types */
const providers: Record<string, Function> = {
  local: localStorageProvider,
  aws: awsStorageProvider,
  azure: azureStorageProvider,
};

export async function storeFile(pilet: PiletVersionWithPilet) {
  const provider: string = storage.provider;

  const invoker = providers[provider];
  if (invoker) {
    invoker(pilet);
  }
}
