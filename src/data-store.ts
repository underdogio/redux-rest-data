import { StoreName, ItemId, Item } from '.'

import { createDataStoreReducer } from './reducer'
import { InitRequestAction } from './actions'
import { trim } from './util'

interface DataStoreOptions {
  baseUrl: string
  storeName: StoreName
}

export function createDataStore<DataType extends Item>(
  options: DataStoreOptions
) {
  const reducer = createDataStoreReducer(options.storeName)

  const baseUrl = trim(options.baseUrl, '/')

  function fetchItem(id: ItemId): InitRequestAction<DataType> {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'get',
      url: `${baseUrl}/${id}`,
      id
    }
  }

  // TODO: Accept query parameters
  function fetchItems(): InitRequestAction<DataType> {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'get',
      url: baseUrl
    }
  }

  function updateItem(
    id: ItemId,
    data: Partial<DataType>
  ): InitRequestAction<DataType> {
    return {
      type: '@underdogio/redux-rest-data/init_request',
      storeName: options.storeName,
      method: 'put',
      url: `${baseUrl}/${id}`,
      data,
      id
    }
  }

  function deleteItem(id: ItemId): InitRequestAction<DataType> {
    return {
      type: '@underdogio/redux-rest-data/init_request',
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
