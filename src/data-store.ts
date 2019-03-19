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
  type RequestOptionsType = Exclude<RequestOptions<DataType>, 'method'>

  const reducer = createDataStoreReducer<DataType>(storeOptions.storeName)
  const baseUrl = trim(storeOptions.baseUrl, '/')

  function fetchItem(
    id: ItemId,
    requestOptions?: RequestOptionsType
  ): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      requestOptions: {
        method: 'get',
        url: `${baseUrl}/${id}`,
        ...requestOptions
      },
      id
    }
  }

  function fetchItems(requestOptions?: RequestOptionsType): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      requestOptions: {
        method: 'get',
        url: baseUrl,
        ...requestOptions
      }
    }
  }

  function updateItem(
    id: ItemId,
    data: Partial<DataType>,
    requestOptions?: Exclude<RequestOptionsType, 'data'>
  ): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      requestOptions: {
        method: 'put',
        url: `${baseUrl}/${id}`,
        data,
        ...requestOptions
      },
      id
    }
  }

  function deleteItem(
    id: ItemId,
    requestOptions?: RequestOptionsType
  ): RequestActionType {
    return {
      type: '@underdogio/redux-rest-data/request',
      storeName: storeOptions.storeName,
      requestOptions: {
        method: 'delete',
        url: `${baseUrl}/${id}`,
        ...requestOptions
      },
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
