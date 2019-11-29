import createStore from 'redux-mock-store'
import { spy } from 'sinon'
import test from 'ava'

import { createMiddleware } from '../src/middleware'
import fetchMock from 'fetch-mock'

test.afterEach.always(t => {
  fetchMock.restore()
})

test.serial('Successful request', async t => {
  fetchMock.get('http://endpoint.api/item/item_id', {
    body: '{}',
    status: 200
  })

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api'
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

  const [url, opts] = fetchMock.lastCall()

  t.deepEqual(url, 'http://endpoint.api/item/item_id')
  t.deepEqual(opts, {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    credentials: 'same-origin'
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
})

test.serial('Failed request', async t => {
  const error = new Error('Bad request')
  fetchMock.get('http://endpoint.api/item/item_id', {
    status: 400,
    throws: error
  })

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api'
  })

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

  const [url, opts] = fetchMock.lastCall()

  t.deepEqual(url, 'http://endpoint.api/item/item_id')
  t.deepEqual(opts, {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    credentials: 'same-origin'
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
})

test('Bad status code', async t => {
  fetchMock.get('http://endpoint.api/item/item_id', {
    status: 400,
    body: 'Bad request'
  })

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api'
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

  const [url, opts] = fetchMock.lastCall()

  t.deepEqual(url, 'http://endpoint.api/item/item_id')
  t.deepEqual(opts, {
    headers: {
      Authorization: 'Bearer token'
    },
    method: 'get',
    credentials: 'same-origin'
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
})

test.serial('Serializing params', async t => {
  fetchMock.get('http://endpoint.api/item/item_id?test_param=value', {
    status: 200,
    body: {}
  })

  function serializeParams(params: any) {
    return 'test_param=value'
  }

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api',
    serializeParams
  })

  const store = createStore()()
  const next = spy()

  await middleware(store)(next)({
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: 'test_id',
    requestOptions: {
      method: 'get',
      headers: {
        Authorization: 'Bearer token'
      },
      url: '/item/item_id',
      params: { a: 1 }
    }
  })

  const [url] = fetchMock.lastCall()

  t.deepEqual(url, 'http://endpoint.api/item/item_id?test_param=value')
})

test.serial('Transforming responses', async t => {
  fetchMock.get('http://endpoint.api/item/item_id', {
    status: 200,
    body: {
      data: {
        nested: 'some nested data that we want to de-nest'
      }
    }
  })

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api',
    transformResponse(response) {
      return response.data.data
    }
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
})

test.serial('Default serializer', async t => {
  fetchMock.get('http://endpoint.api/item/item_id?a=1&b=2', {
    body: {},
    status: 200
  })

  const middleware = createMiddleware({
    baseUrl: 'http://endpoint.api'
  })

  const store = createStore()()
  const next = spy()

  await middleware(store)(next)({
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: 'test_id',
    requestOptions: {
      headers: {
        Authorization: 'Bearer token'
      },
      method: 'get',
      url: '/item/item_id',
      params: {
        a: 1,
        b: 2
      }
    }
  })

  const [url] = fetchMock.lastCall()

  t.deepEqual(url, 'http://endpoint.api/item/item_id?a=1&b=2')
})

test.serial(
  'Mergin headers from middleware options and request options',
  async t => {
    fetchMock.get('http://endpoint.api/item/item_id', {
      body: {},
      status: 200
    })

    const middleware = createMiddleware({
      baseUrl: 'http://endpoint.api',
      requestOptions: {
        headers: {
          some: 'header'
        }
      }
    })

    const store = createStore()()
    const next = spy()

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

    const [url, options] = fetchMock.lastCall()

    t.deepEqual(options.headers, {
      Authorization: 'Bearer token',
      some: 'header'
    })
  }
)
