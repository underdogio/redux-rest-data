# @underdogio/redux-rest-data

Redux store for managing data fetched from a REST API.

## Table of contents

- [Installation](#installation)

- [Usage](#usage)

- [API](#api)

- [Developing](#developing)

- [Publishing a new version](#publishing-a-new-version)

## Installation

Install from npm:

```
yarn add @underdogio/redux-rest-data
```

Configure the middleware:

```typescript
import {middleware} from '@underdogio/redux-rest-data'

const dataStoreMiddleware = middleware({
    baseUrl: 'http://endpoint.api'
  })
)
```

Create reducers for your data stores:

```typescript
import { createDataStore } from '@underdogio/redux-rest-data'

interface DataType {
  id: string
  completed: boolean
  title: string
}

const todosStore = createDataStore<DataType>('todos', {
  baseUrl: '/todos'
})
```

Hook everything up to your Redux store:

```typescript
import { applyMiddleware, combineReducers, createStore } from 'redux'

const reducer = combineReducers({
  data: combineReducers({
    todos: todosDataStore.reducer
  })
})

const store = createStore(reducer, applyMiddleware(dataStoreMiddleware))
```

Start making requests!

```typescript
await store.dispatch(
  // Fetch all completed todos.
  todosStore.actions.fetchItems({
    params: {
      completed: true
    }
  })
)

const { todos } = store.getState().data
todos.ids.map(id => todos.byId[id].data)
```

## Usage

You can check out [/example/index.tsx](/example/index.tsx) if you want to see a working example.

### Setting up the middleware

Before you can start making requests for data, you need to apply the middleware to your store
and pass it information about your API.

```typescript
import { middleware } from '@underdogio/redux-rest-data'

import { applyMiddleware, createStore } from 'redux'

const dataStoreMiddleware = middleware({
  // The base url for your API that you will be making requests to.
  baseUrl: 'http://endpoint.api',

  // Optional settings for all requests. Here we're gonna be including an
  // `Authorization` header with every request made to our API.
  requestOptions: {
    headers: {
      Authorization: 'Bearer token'
    }
  }
})

const store = createStore(appReducer, applyMiddleware(dataStoreMiddleware))
```

### Creating a data store

In order to store data for a resource from your REST API, you need to create a data store for it.

```typescript
import { createDataStore } from '@underdogio/redux-rest-data'

import { combineReducers } from 'redux'

// Initialize a new data store, which includes actions and a reducer for managing its state.
const todosStore = createDataStore('todos', {
  // The base url for todos. This is relative to the API endpoint you specified when initializing the middleware.
  baseUrl: '/todos'
})

// Add the reducer to your store. Here is an example that would make our todos store accessible
// from `store.getState().data.todos`.
const appReducer = combineReducers({
  data: combineReducers({
    todos: todosStore.reducer
  })
})
```

The todos data store would have the following initial state:

```typescript
store.getState() === {
  data: {
    todos: {
      // A map of todos organized by id.
      byId: {
        [id: string]: {
          // The actual data for the todo that was fetched from the API.
          data: TodoData,

          // Meta information about the request status of this todo.
          meta: {
            // Indicates if we are currently making a request for this todo.
            loading: false,

            // Populated with an error for the last request for this todo, if the requst failed.
            // Gets reset to null on the next successful request for this todo.
            error: null
          }
        }
      },

      // An array of ids of all the todos in the store.
      ids: [],

      // Information about the current request state for fetching multiple todos
      // with a get request to the root endpoint (e.g. `GET /todos`).
      meta: {
        // Indicates if we are currently loading all todos or not.
        loading: false,

        // Populated with an error from the last request for all todos, if the request failed.
        // Gets reset to null on the next successful request for all todos.
        error: null
      }
    }
  }
}
```

### Retrieving a single item from the store

You can retrieve single items with their id:

```typescript
const { todos } = store.getState().data
const todo = todos.byId['todo_id']
const { data, meta } = todo
const { loading, error } = meta
```

### Retrieving all items in the store

If you want to get a list of all the items that are currently in the store, you can perform a map
from `ids` to `byId`:

```typescript
const { todos } = store.getState().data
todos.ids.map(id => todos.byId[id].data)
```

### Fetching items

You can fetch a list of items with the `fetchItems()` action creator.
Fetching items will populate the store with data retrieved from the API,
and update any existing items that are already in the store.

```typescript
// A Promise is returned after dispatching the action, so you can wait for the response if you want.
const promise = store.dispatch(
  // GET http://endpoint.api/todos?limit=10&page=2
  todosStore.actions.fetchItems({
    // Optionally include query parameters.
    params: {
      limit: 10,
      page: 2
    }
  })
)

// The store will put in a loading state while we wait for a response
store.getState().data.todos.meta ===
  {
    loading: true,
    error: null
  }

// Wait for the Promise of the request to resolve.
await promise

// The store will now be populated with data from the API.
store.getState().data.todos ===
  {
    byId: {
      todo_id_1: {
        data: {
          // ...
        },
        meta: {
          loading: false,
          error: null
        }
      }
      // Data for other todos...
    },
    ids: [
      'todo_id_1'
      // Ids of all the other todos that we got from the API...
    ],
    meta: {
      loading: false,
      error: null
    }
  }
```

### Fetching a single item

You can also fetch a single item if you know its id. Fetching an item will add it to the store
if it's not in there already, or update it if it is in the store.

```typescript
// A Promise is returned after dispatching the action, so you can wait for the response if you want.
const promise = store.dispatch(
  // GET http://endpoint.api/todos?limit=10&page=2
  todosStore.actions.fetchItem('todo_id')
)

// The state of the requested todo will be put in a loading state while we wait for a response.
// If we don't have the todo yet, we'll add it to the store.
// Example state for a newly added todo:
store.getState().data.todos === {
  byId: {
    todo_id: {
      // We don't have any data for this todo yet.
      data: null,
      meta: {
        loading: true,
        error: null
      }
    },
    // Data for other todos already in the store...
  },
  ids: {
    'todo_id',
    // Ids of other todos already in the store...
  },
  meta: {
    // We're only loading a single todo, so the loading flag for the entire store does not get updated.
    loading: false,
    error: null
  }
}

// Example state for a todo already in the store:
store.getState().data.todos === {
  byId: {
    todo_id: {
      data: {
        // The data that was fetched previously for this todo.
      },
      meta: {
        loading: true,
        error: null
      }
    },
    // Data for other todos already in the store...
  },
  // ...
}

// Wait for the Promise of the request to resolve.
await promise

// The store will now be populated with data from the API.
store.getState().data.todos ===
  {
    byId: {
      todo_id: {
        data: {
          // The data that we just fetched
        },
        meta: {
          loading: false,
          error: null
        }
      }
      // Data for other todos already in the store...
    },
    ids: [
      'todo_id'
      // Ids of all the other todos aleady in the store...
    ],
  }
```

### Updating an item

You can make requests to update items that are already in the store.

```typescript
// A Promise is returned after dispatching the action, so you can wait for the response if you want.
const promise = store.dispatch(
  // GET http://endpoint.api/todos?limit=10&page=2
  todosStore.actions.updateItem('todo_id', {
    // New todo data
  })
)

// The state of the requested todo will be put in a loading state while we wait for a response.
// Example state for a todo already in the store:
store.getState().data.todos ===
  {
    byId: {
      todo_id: {
        data: {
          // The data that was fetched previously for this todo.
        },
        meta: {
          loading: true,
          error: null
        }
      }
      // Data for other todos already in the store...
    }
    // ...
  }

// Wait for the Promise of the request to resolve.
await promise

// The store will now be populated with data from the API.
store.getState().data.todos ===
  {
    byId: {
      todo_id: {
        data: {
          // The data that we got back from the API
        },
        meta: {
          loading: false,
          error: null
        }
      }
      // Data for other todos already in the store...
    },
    ids: [
      'todo_id'
      // Ids of all the other todos aleady in the store...
    ]
  }
```

You can also choose to update an item locally without making a request to the API,
which would update its data in the store immediately:

```typescript
store.dispatch(
  todosStore.actions.updateItem(
    'todo_id',
    {
      // New todo data
    },

    // Update this todo locally without making a request to the API.
    false
  )
)
```

### Deleting an item

You can make requests to delete items that are already in the store.

```typescript
// A Promise is returned after dispatching the action, so you can wait for the response if you want.
const promise = store.dispatch(
  // DELETE http://endpoint.api/todos/todo_id
  todosStore.actions.deleteItem('todo_id')
)

// The state of the requested todo will be put in a loading state while we wait for a response.
// Example state for a todo already in the store:
store.getState().data.todos ===
  {
    byId: {
      todo_id: {
        data: {
          // The data that was fetched previously for this todo.
        },
        meta: {
          loading: true,
          error: null
        }
      }
      // Data for other todos already in the store...
    }
    // ...
  }

// Wait for the Promise of the request to resolve.
await promise

// The todo will have been removed from the store.
store.getState().data.todos ===
  {
    byId: {
      // Data for other todos already in the store...
    },
    ids: [
      // Ids of all the other todos aleady in the store...
    ]
  }
```

## API

For detailed API documentation, refer to the auto-generated [docs](/docs), generated by Typedoc.

## Developing

## Publishing a new version
