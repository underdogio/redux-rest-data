import createStore from 'redux-mock-store'
import { spy } from 'sinon'
import test from 'ava'

import { createDataStoreMiddleware } from '../src/middleware'
import { createAxiosStub } from './util'

test.serial('Configuring middleware', t => {
  const { create } = createAxiosStub()

  createDataStoreMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  t.deepEqual(create.firstCall.args[0], {
    baseURL: 'http://endpoint.api'
  })

  create.restore()
})

test.serial('Successful request', async t => {
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
  const dispatchSpy = spy(store, 'dispatch')

  await middleware(store)(next)({
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: 'test_id',
    requestOptions: {
      headers: {
        Authorization: 'Bearer token'
      },
      method: 'get',
      url: '/item/item_id'
    }
  })

  t.deepEqual(instance.firstCall.args[0], {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    url: '/item/item_id'
  })

  const { firstCall, secondCall } = dispatchSpy

  t.deepEqual(firstCall.args[0], {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: 'test_id',
    method: 'get',
    status: 'started'
  })

  t.deepEqual(secondCall.args[0], {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: 'test_id',
    method: 'get',
    status: 'success',
    data: {}
  })

  create.restore()
})

test.serial('Failed request', async t => {
  const { create, instance } = createAxiosStub()

  const middleware = createDataStoreMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  const error = new Error('Bad request')
  instance.rejects(error)

  const store = createStore()()
  const next = spy()
  const dispatchSpy = spy(store, 'dispatch')

  await t.throwsAsync(async () => {
    return await middleware(store)(next)({
      type: '@underdogio/redux-rest-data/request',
      storeName: 'test',
      id: 'test_id',
      requestOptions: {
        method: 'get',
        headers: {
          Authorization: 'Bearer token'
        },
        url: '/item/item_id'
      }
    })
  })

  t.deepEqual(instance.firstCall.args[0], {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    url: '/item/item_id'
  })

  const { firstCall, secondCall } = dispatchSpy

  t.deepEqual(firstCall.args[0], {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: 'test_id',
    method: 'get',
    status: 'started'
  })

  t.deepEqual(secondCall.args[0], {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: 'test_id',
    method: 'get',
    status: 'failure',
    error
  })

  create.restore()
})
