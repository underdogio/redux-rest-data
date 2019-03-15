import { StoreName, ItemId, Item } from '.'

import { createDataStoreReducer } from './reducer'
import { InitRequestAction } from './actions'

interface DataStoreOptions {
  baseUrl: string
  storeName: StoreName
}

export function createDataStore<DataType extends Item>(
  options: DataStoreOptions
) {
  const reducer = createDataStoreReducer(options.storeName)

  function fetchItem(id: ItemId): InitRequestAction {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'get',
      url: `${options.baseUrl}/${id}`,
      id
    }
  }

  // TODO: Accept query parameters
  function fetchItems(): InitRequestAction {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'get',
      url: options.baseUrl
    }
  }

  function updateItem(id: ItemId, data: Partial<DataType>): InitRequestAction {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'put',
      url: `${options.baseUrl}/${id}`,
      data,
      id
    }
  }

  function deleteItem(id: ItemId): InitRequestAction {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'delete',
      url: `${options.baseUrl}/${id}`,
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
