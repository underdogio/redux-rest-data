import { StoreName, ItemId, Item } from '.'

import { createDataStoreReducer } from './reducer'
import { RequestAction } from './actions'
import { trim } from './util'

interface DataStoreOptions {
  baseUrl: string
  storeName: StoreName
}

export function createDataStore<DataType extends Item>(
  options: DataStoreOptions
) {
  type RequestActionType = RequestAction<DataType>

  const reducer = createDataStoreReducer(options.storeName)

  const baseUrl = trim(options.baseUrl, '/')

  function fetchItem(id: ItemId): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: options.storeName,
      method: 'get',
      url: `${baseUrl}/${id}`,
      id
    }
  }

  // TODO: Accept query parameters
  function fetchItems(): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: options.storeName,
      method: 'get',
      url: baseUrl
    }
  }

  function updateItem(id: ItemId, data: Partial<DataType>): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: options.storeName,
      method: 'put',
      url: `${baseUrl}/${id}`,
      data,
      id
    }
  }

  function deleteItem(id: ItemId): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: options.storeName,
      method: 'delete',
      url: `${baseUrl}/${id}`,
      id
    }
  }

  return {
    reducer,
    fetchItem,
    fetchItems,
    updateItem,
    deleteItem
  }
}
