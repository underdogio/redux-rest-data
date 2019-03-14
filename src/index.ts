import * as actions from '../src/actions'

/**
 * The id of an item in a data store.
 */
export type ItemId = string

/**
 * The name of a data store. The name should be unique to the entire application.
 */
export type StoreName = string

/**
 * An item in the data store that has a unique id.
 */
export interface Item {
  id: ItemId
}

/**
 * Metadata about the status of a request.
 */
export interface RequestStatusMetadata {
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
 * Action for getting the initial state of a reducer. Mostly used for tests.
 */
export interface InitAction {
  type: '@@INIT'
}

/**
 * Possible request methods.
 */
export type RequestMethod = 'get' | 'put' | 'delete'

/**
 * Possible statuses for an in-flight request.
 */
export type RequestStatus = 'started' | 'success' | 'failure'

export function createDataStore(options: { storeName: StoreName }) {
  return {
    fetchItem: actions.createRequestActionCreator({
      storeName: options.storeName,
      method: 'get'
    }),
    fetchItems: actions.createRequestActionCreator({
      storeName: options.storeName,
      method: 'get'
    }),
    updateItem: actions.createRequestActionCreator({
      storeName: options.storeName,
      method: 'put'
    }),
    deleteItem: actions.createRequestActionCreator({
      storeName: options.storeName,
      method: 'delete'
    }),
    reducer: createDataStore({
      storeName: options.storeName
    })
  }
}
