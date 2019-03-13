import test from 'ava'

import { createDataStoreReducer } from '../src/reducer'

interface TestDataType {
  id: string
  name: string
}

/**
 * Helper for initializing a test reducer.
 */
const createTestReducer = (storeName = 'test') => {
  const reducer = createDataStoreReducer<TestDataType>(storeName)
  const initialState = reducer(undefined, {
    type: '@@INIT'
  })
  return {
    initialState,
    reducer
  }
}

const createTestItem = (id: string): TestDataType => {
  return {
    id: id,
    name: `Test item ${id}`
  }
}

test('Initial state', t => {
  const { initialState } = createTestReducer()
  t.snapshot(initialState)
})

test('Adding an item', t => {
  const { initialState, reducer } = createTestReducer()

  const testItem1 = createTestItem('test_id_1')
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_item',
    storeName: 'test',
    id: testItem1.id,
    data: testItem1,
    meta: {
      error: null,
      loading: false
    }
  })
  t.snapshot(state1)

  const testItem2 = createTestItem('test_id_2')
  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/add_item',
    storeName: 'test',
    id: testItem2.id,
    data: testItem2,
    meta: {
      error: null,
      loading: true
    }
  })
  t.snapshot(state2)
})
