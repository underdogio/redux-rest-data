import { applyMiddleware, createStore, Action, combineReducers } from 'redux'
import test from 'ava'

import { middleware, dataStore as createDataStore } from '../src'
import { createAxiosStub, TestItemType } from './helpers'

test.serial('Fetching an item', async t => {
  const { create, instance } = createAxiosStub()

  instance.resolves({
    data: {
      id: 'test_item',
      title: 'Test this super helpful library',
      completed: true
    },
    headers: {},
    status: 200,
    statusText: 'ok',
    config: {}
  })

  const dataStore = createDataStore<TestItemType>({
    baseUrl: '/todos',
    storeName: 'todos'
  })

  const store = createStore(
    dataStore.reducer,
    applyMiddleware(
      middleware({
        baseUrl: 'http://endpoint.api'
      })
    )
  )

  const request = store.dispatch(dataStore.fetchItem('test_item') as Action)

  // TODO: Assert a request was made.

  t.snapshot(store.getState())
  await request
  t.snapshot(store.getState())

  create.restore()
})

test.serial('Multiple data stores', async t => {
  const { create, instance } = createAxiosStub()

  instance.resolves({
    data: {
      id: 'test_item',
      title: 'Test this super helpful library',
      completed: true
    },
    headers: {},
    status: 200,
    statusText: 'ok',
    config: {}
  })

  const dataStore1 = createDataStore<TestItemType>({
    baseUrl: '/todos',
    storeName: 'todos1'
  })

  const dataStore2 = createDataStore<TestItemType>({
    baseUrl: '/todos',
    storeName: 'todos2'
  })

  const store = createStore(
    combineReducers({
      data: combineReducers({
        dataStore1: dataStore1.reducer,
        dataStore2: dataStore2.reducer
      })
    }),
    applyMiddleware(
      middleware({
        baseUrl: 'http://endpoint.api'
      })
    )
  )

  const request = store.dispatch(dataStore1.fetchItem('test_item') as Action)

  t.snapshot(store.getState())
  await request
  t.snapshot(store.getState())

  create.restore()
})
