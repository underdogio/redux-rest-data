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
    name: 'Test item'
  }
}

test('Initial state', t => {
  const { initialState } = createTestReducer()
  t.snapshot(initialState)
})
