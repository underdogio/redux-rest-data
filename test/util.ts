import axios, { AxiosInstance } from 'axios'
import { stub } from 'sinon'

export function createAxiosStub() {
  const create = stub(axios, 'create')
  const instance = stub()

  create.returns((instance as unknown) as AxiosInstance)

  return {
    create,
    instance
  }
}
