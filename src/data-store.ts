import { ItemId, Item, RequestOptions, DataStoreOptions } from '.'

import { createDataStoreReducer } from './reducer'
import { RequestAction, UpdateItemAction } from './actions'
import { trim } from './util'

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
    /**
     * Options for the request. Pass "false" to only update this item locally.
     */
    requestOptions?: false | Exclude<RequestOptionsType, 'data'>
  ): UpdateItemAction<DataType> | RequestActionType {
    if (requestOptions === false) {
      return {
        type: '@underdogio/redux-rest-data/update_item',
        storeName: storeOptions.storeName,
        id,
        data
      }
    }

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
    actions: {
      fetchItem,
      fetchItems,
      updateItem,
      deleteItem
    },
    reducer
  }
}
