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

test('Updating an item', t => {
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

  const state5 = reducer(state4, {
    type: '@underdogio/redux-rest-data/update_item',
    storeName: 'test',
    id: 'test_id_does_not_exist',
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
  t.deepEqual(state5, state4)
})

test('Removing an item', t => {
  const { initialState, reducer } = createTestReducer()

  // Add some items to remove
  const testItems = ['test_id_1', 'test_id_2'].map(createTestItem)
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: testItems
  })

  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/remove_item',
    storeName: 'test',
    id: 'test_id_1'
  })
  t.snapshot(state2)

  const state3 = reducer(state2, {
    type: '@underdogio/redux-rest-data/remove_item',
    storeName: 'test',
    id: 'test_id_1'
  })
  t.snapshot(state3, 'Item that does not exist')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/remove_item',
    storeName: 'test',
    id: 'test_id_2'
  })
  t.snapshot(state4, 'Empty store')
})

test('Requesting a list of items', t => {
  const { initialState, reducer } = createTestReducer()

  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    status: 'started',
    method: 'get'
  })
  t.snapshot(state1, 'Request start')

  const items = ['test_id_1', 'test_id_2'].map(createTestItem)
  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    data: items,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state2, 'Request success')

  const state3 = reducer(state1, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    error: {
      status: 404
    },
    method: 'get',
    status: 'failure'
  })
  t.snapshot(state3, 'Request failure')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    data: items,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state4, 'Request success after a failure')
})

test('Requesting a single item [GET]', t => {
  const { initialState, reducer } = createTestReducer()

  const item_id = 'test_id_1'

  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: item_id,
    status: 'started',
    method: 'get'
  })
  t.snapshot(state1, 'Request start')

  const item = createTestItem(item_id)
  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: item_id,
    data: item,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state2, 'Request success')

  const state3 = reducer(state1, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: item_id,
    error: {
      status: 404
    },
    method: 'get',
    status: 'failure'
  })
  t.snapshot(state3, 'Request failure')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'test',
    id: item_id,
    data: item,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state4, 'Request success after a failure')
})
