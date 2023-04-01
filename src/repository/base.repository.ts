/* eslint-disable @typescript-eslint/no-unused-vars */
// import all interfaces
import prisma from '../helpers/prisma-client';
import { IRead } from './interfaces/IRead';
import { IWrite } from './interfaces/IWrite';

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public readonly _client;

  constructor() {
    this._client = prisma;
  }

  async create(item: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  async findOne(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
