import { combineReducers, createStore, applyMiddleware } from 'redux'
import util from 'util'

import { middleware, dataStore } from '../src'

const stringifyObject = (toStringify: any, depth = 4) =>
  util.inspect(toStringify, {
    depth
  })

async function runExample() {
  const dataStoreMiddleware = middleware({
    baseUrl: 'https://jsonplaceholder.typicode.com'
  })

  interface Todo {
    id: string
    title: string
    completed: boolean
  }

  const todosStore = dataStore<Todo>({
    storeName: 'todos',
    baseUrl: 'todos'
  })

  const reducer = combineReducers({
    todos: todosStore.reducer
  })

  const store = createStore(reducer, applyMiddleware(dataStoreMiddleware))

  console.log('Fetching todos...')
  await store.dispatch(todosStore.fetchItems())

  const firstTodoId = store.getState().todos.ids[0]
  console.log(
    'First todo: ',
    stringifyObject(store.getState().todos.byId[firstTodoId])
  )

  console.log('Updating todo...')
  await store.dispatch(
    todosStore.updateItem(firstTodoId, {
      id: firstTodoId,
      title: 'test this sick library',
      completed: true
    })
  )
  console.log(
    'Updated todo:',
    stringifyObject(store.getState().todos.byId[firstTodoId])
  )
}

runExample()
