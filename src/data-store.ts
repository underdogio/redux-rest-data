import { StoreName, ItemId, Item, RequestOptions } from '.'

import { createDataStoreReducer } from './reducer'
import { RequestAction } from './actions'
import { trim } from './util'

interface DataStoreOptions {
  baseUrl: string
  storeName: StoreName
}

export function createDataStore<DataType extends Item>(
  storeOptions: DataStoreOptions
) {
  type RequestActionType = RequestAction<DataType>
  type RequestOptionsType = RequestOptions<DataType>

  const reducer = createDataStoreReducer(storeOptions.storeName)

  const baseUrl = trim(storeOptions.baseUrl, '/')

  function fetchItem(
    id: ItemId,
    requestOptions: RequestOptionsType
  ): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      method: 'get',
      url: `${baseUrl}/${id}`,
      id,
      ...requestOptions
    }
  }

  function fetchItems(requestOptions: RequestOptionsType): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      method: 'get',
      url: baseUrl,
      ...requestOptions
    }
  }

  function updateItem(
    id: ItemId,
    requestOptions: RequestOptionsType
  ): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      method: 'put',
      url: `${baseUrl}/${id}`,
      id,
      ...requestOptions
    }
  }

  function deleteItem(
    id: ItemId,
    requestOptions: RequestOptionsType
  ): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      method: 'delete',
      url: `${baseUrl}/${id}`,
      id,
      ...requestOptions
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
