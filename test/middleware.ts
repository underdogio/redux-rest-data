import createStore from 'redux-mock-store'
import { spy } from 'sinon'
import test from 'ava'

import { createMiddleware } from '../src/middleware'
import { createAxiosStub } from './helpers'

test.serial('Configuring middleware', t => {
  const { create } = createAxiosStub()

  createMiddleware({
    baseUrl: 'http://endpoint.api',
    requestOptions: {
      headers: {
        Authorization: 'Bearer token'
      }
    }
  })

  t.deepEqual(create.firstCall.args[0], {
    baseURL: 'http://endpoint.api',
    headers: {
      Authorization: 'Bearer token'
    }
  })

  create.restore()
})

test.serial('Successful request', async t => {
  const { create, instance } = createAxiosStub()

  const middleware = createMiddleware({
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
    url: '/item/item_id',
    withCredentials: true
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

  const middleware = createMiddleware({
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
    url: '/item/item_id',
    withCredentials: true
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

test.serial('Bad status code', async t => {
  const { create, instance } = createAxiosStub()

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  instance.resolves({
    status: 400,
    message: 'Bad request'
  })

  const store = createStore()()
  const next = spy()
  const dispatchSpy = spy(store, 'dispatch')

  // An error should not be thrown
  await middleware(store)(next)({
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

  t.deepEqual(instance.firstCall.args[0], {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    url: '/item/item_id',
    withCredentials: true
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
    error: {
      status: 400,
      message: 'Bad request'
    }
  })

  create.restore()
})

test.serial('Serializing params', async t => {
  const { create } = createAxiosStub()

  function serializeParams(params: any) {
    return 'test_param=value'
  }

  createMiddleware({
    baseUrl: 'http://endpoint.api',
    serializeParams
  })

  t.deepEqual(create.firstCall.args[0], {
    baseURL: 'http://endpoint.api',
    paramsSerializer: serializeParams
  })

  create.restore()
})

test.serial('Transforming responses', async t => {
  const { create, instance } = createAxiosStub()

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api',
    transformResponse(response) {
      return response.data.data
    }
  })

  instance.resolves({
    data: {
      data: {
        nested: 'some nested data that we want to de-nest'
      }
    },
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

  const { secondCall } = dispatchSpy

  t.deepEqual(secondCall.args[0], {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: 'test_id',
    method: 'get',
    status: 'success',
    data: {
      nested: 'some nested data that we want to de-nest'
    }
  })

  create.restore()
})
