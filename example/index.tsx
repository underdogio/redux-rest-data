import React from 'react'
import { render } from 'react-dom'

import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider, connect } from 'react-redux'

import { middleware, createDataStore } from '../src'
import { DataStoreState } from '../src/reducer'

interface Todo {
  id: string
  title: string
  completed: boolean
}

const createDataStoreMiddleware = middleware({
  baseUrl: 'https://jsonplaceholder.typicode.com/'
})

const todosDataStore = createDataStore<Todo>({
  baseUrl: 'todos',
  storeName: 'todos'
})

interface ApplicationState {
  data: {
    todos: DataStoreState<Todo>
  }
}

const store = createStore(
  combineReducers({
    data: combineReducers({
      todos: todosDataStore.reducer
    })
  }),
  applyMiddleware(createDataStoreMiddleware)
)

const mapStateToProps = (state: ApplicationState) => {
  return {
    data: state.data
  }
}

const mapDispatchToProps = {
  fetchTodos: todosDataStore.actions.fetchItems
}

function TodosList(props: { todos: Todo[] }) {
  return (
    <ul>
      {props.todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}

function Example(props: {
  data: {
    todos: DataStoreState<Todo>
  }
  fetchTodos: () => any
}) {
  const todosState = props.data.todos
  const todos = todosState.ids.map(id => props.data.todos.byId[id].data)

  return (
    <>
      <button
        onClick={() => {
          props.fetchTodos()
        }}
      >
        {todos.length === 0 ? 'Load todos' : 'Refresh todos'}
      </button>
      {todosState.meta.loading && <p>Loading...</p>}
      {!todosState.meta.loading && todos.length > 0 && (
        <p>{todos.length} todos</p>
      )}
      {todos.length > 0 && <TodosList todos={todos} />}
    </>
  )
}

const ConnectedExample = connect(
  mapStateToProps,
  mapDispatchToProps
)(Example)

render(
  <Provider store={store}>
    <ConnectedExample />
  </Provider>,
  document.getElementById('root')
)
