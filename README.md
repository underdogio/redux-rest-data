# @underdogio/redux-rest-data

Redux store for managing data fetched from a REST API.

## Table of contents

- [Installation](#installation)

- [Examples](#examples)

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

Start dispatching some actions:

```typescript
await store.dispatch(
  todosStore.actions.fetchItems({
    params: {
      completed: true
    }
  })
)

const { todos } = store.getState().data
todos.ids.map(id => todos.byId[id].data)
```

## Examples

## API

For detailed API documentation refer to the auto-generated [docs](/docs) generated by Typedoc.

## Developing

## Publishing a new version
