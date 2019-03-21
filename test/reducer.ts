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

test('Ignoring actions meant for other stores', t => {
  const { initialState, reducer } = createTestReducer()
  const item = createTestItem('test_id_1')

  t.deepEqual(
    initialState,
    reducer(initialState, {
      type: '@underdogio/redux-rest-data/add_item',
      storeName: 'other_store',
      id: item.id,
      data: item,
      meta: {
        error: null,
        loading: false
      }
    })
  )

  t.deepEqual(
    initialState,
    reducer(initialState, {
      type: '@underdogio/redux-rest-data/add_items',
      storeName: 'other_store',
      data: [item]
    })
  )

  t.deepEqual(
    initialState,
    reducer(initialState, {
      type: '@underdogio/redux-rest-data/update_item',
      storeName: 'other_store',
      id: item.id,
      data: item
    })
  )

  t.deepEqual(
    initialState,
    reducer(initialState, {
      type: '@underdogio/redux-rest-data/update_request_status',
      storeName: 'other_store',
      id: item.id,
      method: 'get',
      status: 'started'
    })
  )
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

  // Add some items to delete
  const testItems = ['test_id_1', 'test_id_2'].map(createTestItem)
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: testItems
  })

  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/delete_item',
    storeName: 'test',
    id: 'test_id_1'
  })
  t.snapshot(state2)

  const state3 = reducer(state2, {
    type: '@underdogio/redux-rest-data/delete_item',
    storeName: 'test',
    id: 'test_id_1'
  })
  t.snapshot(state3, 'Item that does not exist')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/delete_item',
    storeName: 'test',
    id: 'test_id_2'
  })
  t.snapshot(state4, 'Empty store')
})

test('Updating status of a request for a list of items', t => {
  const { initialState, reducer } = createTestReducer()

  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    status: 'started',
    method: 'get'
  })
  t.snapshot(state1, 'Request start')

  const items = ['test_id_1', 'test_id_2'].map(createTestItem)
  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    data: items,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state2, 'Request success')

  const state3 = reducer(state1, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    error: {
      status: 404
    },
    method: 'get',
    status: 'failure'
  })
  t.snapshot(state3, 'Request failure')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    data: items,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state4, 'Request success after a failure')
})

test('Updating status of a request for a single item [GET]', t => {
  const { initialState, reducer } = createTestReducer()

  // Item to be requested
  const itemId = 'test_id_1'
  const item = createTestItem(itemId)

  // Add a pre-existing item
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_item',
    storeName: 'test',
    data: createTestItem('test_id_2'),
    meta: {
      error: null,
      loading: false
    },
    id: 'test_id_2'
  })

  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    status: 'started',
    method: 'get'
  })
  t.snapshot(state2, 'Request start')

  const state3 = reducer(state2, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    data: item,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state3, 'Request success')

  const state4 = reducer(state3, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    error: {
      status: 404
    },
    method: 'get',
    status: 'failure'
  })
  t.snapshot(state4, 'Request failure')

  const state5 = reducer(state4, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    data: item,
    method: 'get',
    status: 'success'
  })
  t.snapshot(state5, 'Request success after a failure')
})

test('Updating status of a request for a single item [PUT]', t => {
  const { initialState, reducer } = createTestReducer()

  // Add an item to update
  const itemId = 'test_id_1'
  const items = [itemId, 'test_id_2'].map(createTestItem)
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: items
  })

  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    method: 'put',
    status: 'started'
  })
  t.snapshot(state2, 'Request start')

  const updatedItem1: Partial<TestDataType> = {
    id: itemId,
    name: 'Updated name test_id_1'
  }
  const state3 = reducer(state2, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    data: updatedItem1,
    method: 'put',
    status: 'success'
  })
  t.snapshot(state3, 'Request success')

  const state4 = reducer(state2, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    error: {
      status: 400
    },
    method: 'put',
    status: 'failure'
  })
  t.snapshot(state4, 'Request failure')

  const updatedItem2: Partial<TestDataType> = {
    id: itemId,
    name: 'Updated name again test_id_1'
  }
  const state5 = reducer(state4, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    data: updatedItem2,
    method: 'put',
    status: 'success'
  })
  t.snapshot(state5, 'Request success after a failure')
})

test('Updating status of a request for a single item [DELETE]', t => {
  const { initialState, reducer } = createTestReducer()

  // Add an item to delete
  const itemId = 'test_id_1'
  const items = [itemId, 'test_id_2'].map(createTestItem)
  const state1 = reducer(initialState, {
    type: '@underdogio/redux-rest-data/add_items',
    storeName: 'test',
    data: items
  })

  const state2 = reducer(state1, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    method: 'delete',
    status: 'started'
  })
  t.snapshot(state2, 'Request start')

  const state3 = reducer(state2, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    method: 'delete',
    status: 'success'
  })
  t.snapshot(state3, 'Request success')

  const state4 = reducer(state2, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    error: {
      status: 404
    },
    method: 'delete',
    status: 'failure'
  })
  t.snapshot(state4, 'Request failure')

  const state5 = reducer(state4, {
    type: '@underdogio/redux-rest-data/update_request_status',
    storeName: 'test',
    id: itemId,
    method: 'delete',
    status: 'success'
  })
  t.snapshot(state5, 'Request success after a failure')
})
