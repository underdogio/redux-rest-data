import test from 'ava'

import { createDataStore } from '../src/data-store'
import { TestItemType } from './util'

const createTestStore = () => {
  return createDataStore<TestItemType>({
    baseUrl: '/todos',
    storeName: 'todos'
  })
}

test('Reducer', t => {
  const { reducer } = createTestStore()
  const initialState = reducer(undefined, {
    type: '@@INIT'
  })
  t.deepEqual(initialState, {
    byId: {},
    ids: [],
    meta: {
      error: null,
      loading: false
    }
  })

  const testAction: any = {
    type: '@underdogio/redux-rest-data/add_item',
    id: 'test_todo',
    data: {
      id: 'test_todo',
      title: 'Test this super helpful library',
      completed: true
    },
    meta: {
      error: null,
      loading: false
    }
  }

  t.snapshot(
    reducer(initialState, {
      ...testAction,
      storeName: 'todos'
    })
  )

  t.deepEqual(
    reducer(initialState, {
      ...testAction,
      storeName: 'someOtherStore'
    }),
    initialState
  )
})

test('Fetch items action creator', t => {
  const { fetchItems } = createTestStore()
  t.deepEqual(fetchItems(), {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'todos',
    requestOptions: {
      method: 'get',
      url: 'todos'
    }
  })

  t.deepEqual(
    fetchItems({
      params: {
        page: 5,
        limit: 10
      }
    }),
    {
      type: '@underdogio/redux-rest-data/request',
      storeName: 'todos',
      requestOptions: {
        method: 'get',
        url: 'todos',
        params: {
          page: 5,
          limit: 10
        }
      }
    }
  )
})

test('Fetch item action creator', t => {
  const { fetchItem } = createTestStore()
  t.deepEqual(fetchItem('todo_id'), {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'todos',
    id: 'todo_id',
    requestOptions: {
      method: 'get',
      url: 'todos/todo_id'
    }
  })

  t.deepEqual(
    fetchItem('todo_id', {
      params: {
        fields: ['completed', 'title']
      }
    }),
    {
      type: '@underdogio/redux-rest-data/request',
      storeName: 'todos',
      id: 'todo_id',
      requestOptions: {
        method: 'get',
        url: 'todos/todo_id',
        params: {
          fields: ['completed', 'title']
        }
      }
    }
  )
})

test('Update item creator', t => {
  const { updateItem } = createTestStore()

  t.deepEqual(
    updateItem('todo_id', {
      title: 'Test this super helpful library'
    }),
    {
      type: '@underdogio/redux-rest-data/request',
      storeName: 'todos',
      id: 'todo_id',
      requestOptions: {
        method: 'put',
        url: 'todos/todo_id',
        data: {
          title: 'Test this super helpful library'
        }
      }
    }
  )

  t.deepEqual(
    updateItem(
      'todo_id',
      {
        title: 'Test this super helpful library'
      },
      {
        headers: {
          'X-Test-Header': 'test_header'
        }
      }
    ),
    {
      type: '@underdogio/redux-rest-data/request',
      storeName: 'todos',
      id: 'todo_id',
      requestOptions: {
        method: 'put',
        url: 'todos/todo_id',
        headers: {
          'X-Test-Header': 'test_header'
        },
        data: {
          title: 'Test this super helpful library'
        }
      }
    }
  )
})

test('Delete item creator', t => {
  const { deleteItem } = createTestStore()
  t.deepEqual(deleteItem('todo_id'), {
    type: '@underdogio/redux-rest-data/request',
    storeName: 'todos',
    id: 'todo_id',
    requestOptions: {
      method: 'delete',
      url: 'todos/todo_id'
    }
  })

  t.deepEqual(
    deleteItem('todo_id', {
      headers: {
        'X-Test-Header': 'test_header'
      }
    }),
    {
      type: '@underdogio/redux-rest-data/request',
      storeName: 'todos',
      id: 'todo_id',
      requestOptions: {
        method: 'delete',
        url: 'todos/todo_id',
        headers: {
          'X-Test-Header': 'test_header'
        }
      }
    }
  )
})
