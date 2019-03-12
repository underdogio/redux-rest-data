import {Item, StoreName, ItemId} from '.'
import {baseActionType} from './actions'

/**
 * Metadata about the status of a request.
 */
interface RequestStatusMetadata {
  /**
   * Contains the error object from the last request if it resulted in an error.
   * This gets reset to `null` if the last request completed successfully.
   */
  error: any

  /**
   * Indicates if a request is currently being made.
   */
  loading: boolean
}

/**
 * The state of a data store.
 */
interface DataStoreState<DataType extends Item> {
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

export function createDataStoreReducer<DataType extends Item>(storeName: StoreName) {
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
   * Determine if a given action is valid for this data store.
   */
  function isValidAction (action: any) {
    return action.type === baseActionType && action.storeName === storeName
  }

  function addItem(state: DataStoreStateType, id: ItemId, options: {
    data?: DataType
    meta: RequestStatusMetadata
  }): DataStoreStateType {
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          data: options.data,
          meta: options.meta
        }
      },
      ids: state.ids.concat([
        id
      ])
    }
  }

  function addItems(state: DataStoreStateType, items: DataType[]): DataStoreStateType {
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
      items.map(item => item.id)
      .filter(id => state.ids.indexOf(id) < 0)
    )
    return {
      ...state,
      byId,
      ids
    }
  }

  function updateItem(state: DataStoreStateType, id: ItemId, options: {
    data: Partial<DataType>
    meta: Partial<RequestStatusMetadata>
  }): DataStoreStateType {
    const currentItemState = state.byId[id]
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          ...currentItemState,
          data: {
            ...currentItemState.data,
            ...options.data
          },
          meta: {
            ...currentItemState.meta,
            ...options.meta
          }
        }
      }
    }
  }

  function removeItem(state: DataStoreStateType, id: ItemId) {
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

  return function dataStoreReducer (state: DataStoreStateType = initialState, action): DataStoreStateType {
    // Ignore actions that were not meant for this data store.
    if (!isValidAction(action)) {
      return state
    }

    return state
  }
}
