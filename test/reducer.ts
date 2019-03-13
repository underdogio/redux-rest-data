import test from 'ava'

import { createDataStoreReducer } from '../src/reducer'

interface TestDataType {
  id: string
  name: string
  prop: string
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
    name: `Test item ${id}`,
    prop: `fake prop ${id}`
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

test('Adding multiple items', t => {
  const { initialState, reducer } = createTestReducer()

  const items1 = ['test_id_1', 'test_id_2'].map(createTestItem)
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: items1
  })
  t.snapshot(state1)

  // Test that items are not duplicated if they are already in the store.
  const items2 = ['test_id_2', 'test_id_3', 'test_id_4'].map(createTestItem)
  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: items2
  })
  t.snapshot(state2)
  t.deepEqual(state2.ids, ['test_id_1', 'test_id_2', 'test_id_3', 'test_id_4'])
})

test('Updating an existing item', t => {
  const { initialState, reducer } = createTestReducer()

  // Populate store with some items to update
  const items = ['test_id_1', 'test_id_2'].map(createTestItem)
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: items
  })

  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/update_item',
    storeName: 'test',
    id: 'test_id_1',
    data: {
      name: 'Updated name test_id_1'
    }
  })
  t.snapshot(state2, 'Partial data update')

  const state3 = reducer(state2, {
    type: '@underdogio/redux-rest-data/update_item',
    storeName: 'test',
    id: 'test_id_1',
    meta: {
      loading: true
    }
  })
  t.snapshot(state3, 'Partial meta update')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/update_item',
    storeName: 'test',
    id: 'test_id_1',
    data: {
      name: 'Updated name again test_id_1'
    },
    meta: {
      error: {
        message: 'Not found',
        status: 404
      }
    }
  })
  t.snapshot(state4, 'Partial meta and data update')
})
