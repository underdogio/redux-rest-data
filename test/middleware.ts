import axios, { AxiosInstance } from 'axios'
import createStore from 'redux-mock-store'
import { spy, stub } from 'sinon'
import test from 'ava'

import { createDataStoreMiddleware } from '../src/middleware'

function createAxiosStub() {
  const create = stub(axios, 'create')
  const instance = stub()

  create.returns((instance as unknown) as AxiosInstance)

  return {
    create,
    instance
  }
}

test('Configuring middleware', t => {
  const { create } = createAxiosStub()

  createDataStoreMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  t.deepEqual(create.firstCall.args[0], {
    baseURL: 'http://endpoint.api'
  })

  create.restore()
})

test('Starting a request', async t => {
  const { create, instance } = createAxiosStub()

  const middleware = createDataStoreMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  instance.resolves({
    data: {},
    headers: {},
    status: 200,
    statusText: 'ok',
    config: {}
  })

  const store = createStore()()
  const next = spy()

  await middleware(store)(next)({
    type: '@underdogio/redux-rest-data/init_request',
    storeName: 'test',
    id: 'test_id',
    method: 'get',
    headers: {
      Authorization: 'Bearer token'
    },
    url: '/item/item_id'
  })

  t.deepEqual(instance.firstCall.args[0], {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    url: '/item/item_id'
  })

  create.restore()
})
