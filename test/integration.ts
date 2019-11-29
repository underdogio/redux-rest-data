import { applyMiddleware, createStore, Action, combineReducers } from 'redux'
import test from 'ava'

import { middleware, createDataStore } from '../src'
import { TestItemType } from './helpers'
import fetchMock from 'fetch-mock'

test.afterEach.always(t => {
  fetchMock.restore()
})

test.serial.only('Fetching an item', async t => {
  fetchMock.get('http://endpoint.api/todos/test_item', {
    body: {
      id: 'test_item',
      title: 'Test this super helpful library',
      completed: true
    },
    status: 200
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

  const request = store.dispatch(dataStore.actions.fetchItem(
    'test_item'
  ) as Action)

  t.snapshot(store.getState(), 'store before request')
  await request
  t.snapshot(store.getState(), 'store after request')
})

test.serial.only('Multiple data stores', async t => {
  fetchMock.get('http://endpoint.api/todos/test_item', {
    body: {
      id: 'test_item',
      title: 'Test this super helpful library',
      completed: true
    },
    status: 200
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

  const request = store.dispatch(dataStore1.actions.fetchItem(
    'test_item'
  ) as Action)

  t.snapshot(store.getState())
  await request
  t.snapshot(store.getState())
})
