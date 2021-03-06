import { Item, StoreName, ItemId, RequestStatusMetadata, InitAction } from '.'
import { DataStoreAction, UpdateRequestStatusAction } from './actions'

/**
 * The state of a data store.
 */
export interface DataStoreState<DataType extends Item> {
  /**
   * Items organized by ID.
   */
  byId: {
    [id: string]: {
      /**
       * The data of an item, fetched from an API.
       */
      data: DataType

      /**
       * Metadata about the request status of this item.
       */
      meta: RequestStatusMetadata
    }
  }

  /**
   * Array of the ids of all the items currently in the store.
   */
  ids: ItemId[]

  /**
   * Metadata about the request status of the entire store.
   */
  meta: RequestStatusMetadata
}

export function createDataStoreReducer<DataType extends Item>(
  storeName: StoreName
) {
  type DataStoreStateType = DataStoreState<DataType>

  const initialState: DataStoreStateType = {
    byId: {},
    ids: [],
    meta: {
      error: null,
      loading: false
    }
  }

  /**
   * Determine if a given action is meant for this data store.
   */
  function isActionForStore(action: any) {
    return action.storeName === storeName
  }

  function addItem(
    state: DataStoreStateType,
    id: ItemId,
    options: {
      data?: DataType
      meta: RequestStatusMetadata
    }
  ): DataStoreStateType {
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          data: options.data,
          meta: options.meta
        }
      },
      ids: state.ids.concat([id])
    }
  }

  function addItems(
    state: DataStoreStateType,
    items: DataType[]
  ): DataStoreStateType {
    const byId = items.reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: {
          data: item,
          meta: {
            error: null,
            loading: false
          }
        }
      }
    }, state.byId)
    const ids = state.ids.concat(
      items.map(item => item.id).filter(id => state.ids.indexOf(id) < 0)
    )
    return {
      ...state,
      byId,
      ids
    }
  }

  function updateItem(
    state: DataStoreStateType,
    id: ItemId,
    options: {
      data?: Partial<DataType>
      meta?: Partial<RequestStatusMetadata>
    }
  ): DataStoreStateType {
    const currentItemState = state.byId[id]
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          ...currentItemState,
          data: options.data
            ? {
                ...currentItemState.data,
                ...options.data
              }
            : currentItemState.data,
          meta: options.meta
            ? {
                ...currentItemState.meta,
                ...options.meta
              }
            : currentItemState.meta
        }
      }
    }
  }

  function deleteItem(
    state: DataStoreStateType,
    id: ItemId
  ): DataStoreStateType {
    const byId = {
      ...state.byId
    }
    delete byId[id]
    const ids = state.ids.filter(i => i !== id)
    return {
      ...state,
      byId,
      ids
    }
  }

  function handleSingleItemRequest(
    state: DataStoreStateType,
    action: UpdateRequestStatusAction<DataType>
  ): DataStoreStateType {
    const itemExists = state.ids.indexOf(action.id) >= 0

    if (action.status === 'started') {
      // whatever
      if (itemExists) {
        return updateItem(state, action.id, {
          meta: {
            loading: true
          }
        })
      } else {
        return addItem(state, action.id, {
          data: null,
          meta: {
            error: null,
            loading: true
          }
        })
      }
    } else if (action.status === 'success') {
      if (action.method === 'get' || action.method === 'put') {
        return updateItem(state, action.id, {
          data: action.data as DataType,
          meta: {
            error: null,
            loading: false
          }
        })
      } else if (action.method === 'delete') {
        return deleteItem(state, action.id)
      }
    } else if (action.status === 'failure') {
      return updateItem(state, action.id, {
        meta: {
          error: action.error,
          loading: false
        }
      })
    }
  }

  function handleItemListRequest(
    state: DataStoreStateType,
    action: UpdateRequestStatusAction<DataType>
  ): DataStoreStateType {
    // No need to handle separate methods here.
    if (action.status === 'started') {
      return {
        ...state,
        meta: {
          ...state.meta,
          loading: true
        }
      }
    } else if (action.status === 'success') {
      return {
        ...addItems(state, action.data as DataType[]),
        meta: {
          ...state.meta,
          error: null,
          loading: false
        }
      }
    } else if (action.status === 'failure') {
      return {
        ...state,
        meta: {
          ...state.meta,
          error: action.error,
          loading: false
        }
      }
    }
  }

  return function dataStoreReducer(
    state: DataStoreStateType = initialState,
    action: DataStoreAction<DataType> | InitAction
  ): DataStoreStateType {
    // Ignore actions that were not meant for this data store.
    if (!isActionForStore(action)) {
      return state
    }

    switch (action.type) {
      case '@underdogio/redux-rest-data/update_request_status':
        return action.id
          ? handleSingleItemRequest(state, action)
          : handleItemListRequest(state, action)
      case '@underdogio/redux-rest-data/add_items':
        return addItems(state, action.data)
      case '@underdogio/redux-rest-data/add_item':
        return addItem(state, action.id, {
          data: action.data,
          meta: action.meta
        })
      case '@underdogio/redux-rest-data/update_item':
        return state.ids.indexOf(action.id) >= 0
          ? updateItem(state, action.id, {
              data: action.data,
              meta: action.meta
            })
          : state
      case '@underdogio/redux-rest-data/delete_item':
        return deleteItem(state, action.id)
    }
  }
}
