import axios, { AxiosInstance } from 'axios'
import { stub } from 'sinon'
import { Item } from '../../src'

export interface TestItemType extends Item {
  title: string
  completed: boolean
}

export function createAxiosStub() {
  const create = stub(axios, 'create')
  const instance = stub()

  create.returns((instance as unknown) as AxiosInstance)

  return {
    create,
    instance
  }
}
