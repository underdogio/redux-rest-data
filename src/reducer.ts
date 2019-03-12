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

  return function dataStoreReducer (state: DataStoreStateType = initialState, action): DataStoreStateType {
    // Ignore actions that were not meant for this data store.
    if (!isValidAction(action)) {
      return state
    }

    return state
  }
}
