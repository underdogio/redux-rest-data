import test from 'ava'

import * as actions from '../src/actions'
import { TestItemType } from '../test/helpers'

test('addItem()', t => {
  t.snapshot(
    actions.addItem<TestItemType>({
      storeName: 'todo',
      id: 'todo_id',
      meta: {
        error: null,
        loading: true
      }
    })
  )

  t.snapshot(
    actions.addItem<TestItemType>({
      storeName: 'todo',
      id: 'todo_id',
      data: {
        completed: true,
        title: 'test action creators',
        id: 'todo_id'
      }
    })
  )
})

test('addItems()', t => {
  t.snapshot(
    actions.addItems<TestItemType>({
      storeName: 'todo',
      data: [
        {
          completed: true,
          title: 'test action creators',
          id: 'todo_id'
        }
      ]
    })
  )
})

test('deleteItem()', t => {
  t.snapshot(
    actions.deleteItem({
      storeName: 'todo',
      id: 'todo_id'
    })
  )
})

test('updateItem()', t => {
  t.snapshot(
    actions.updateItem<TestItemType>({
      storeName: 'todo',
      id: 'todo_id',
      data: {
        completed: false
      }
    })
  )

  t.snapshot(
    actions.updateItem<TestItemType>({
      storeName: 'todo',
      id: 'todo_id',
      meta: {
        loading: false
      }
    })
  )
})

test('updateRequestStatus()', t => {
  t.snapshot(
    actions.updateRequestStatus<TestItemType>({
      storeName: 'todo',
      id: 'todo_id',
      method: 'put',
      status: 'started'
    })
  )

  t.snapshot(
    actions.updateRequestStatus<TestItemType>({
      storeName: 'todo',
      method: 'get',
      status: 'success',
      data: [
        {
          completed: true,
          title: 'test action creators',
          id: 'todo_id'
        }
      ]
    })
  )

  t.snapshot(
    actions.updateRequestStatus<TestItemType>({
      storeName: 'todo',
      id: 'todo_id',
      method: 'put',
      status: 'failure',
      error: {
        status: 404
      }
    })
  )
})
