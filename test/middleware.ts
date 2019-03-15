import axios, { AxiosInstance } from 'axios'
import createStore from 'redux-mock-store'
import { spy, stub } from 'sinon'
import test from 'ava'

import { createDataStoreMiddleware } from '../src/middleware'

test('Configuring middleware', t => {
  const clientStub = stub(axios, 'create')
  const axiosSpy = stub()
  clientStub.returns((axiosSpy as unknown) as AxiosInstance)

  createDataStoreMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  t.deepEqual(clientStub.firstCall.args[0], {
    baseURL: 'http://endpoint.api'
  })

  clientStub.restore()
})

test('Starting a request', async t => {
  const clientStub = stub(axios, 'create')
  const axiosStub = stub()
  clientStub.returns((axiosStub as unknown) as AxiosInstance)

  const middleware = createDataStoreMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  axiosStub.returns(
    new Promise((resolve, reject) => {
      resolve({
        data: {},
        headers: {},
        status: 200,
        statusText: 'ok',
        config: {}
      })
    })
  )

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

  t.deepEqual(axiosStub.firstCall.args[0], {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    url: '/item/item_id'
  })
})
