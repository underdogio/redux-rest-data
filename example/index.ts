import { combineReducers, createStore, applyMiddleware } from 'redux'
import util from 'util'

import { middleware, dataStore } from '../src'

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

  const logState = () => {
    console.log(
      'STATE',
      util.inspect(store.getState(), {
        depth: 4
      })
    )
  }

  logState()

  console.log('Fetching todos...')
  await store.dispatch(todosStore.fetchItems())

  console.log('Updating todos...')
  const firstTodoId = store.getState().todos.ids[0]
  await store.dispatch(
    todosStore.updateItem(firstTodoId, {
      id: firstTodoId,
      title: 'Hello'
    })
  )
  console.log('TODO', store.getState().todos.byId[firstTodoId])
}

runExample()
