import { createDataStore } from './data-store'
import { createDataStoreMiddleware } from './middleware'

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
 * Options for an API request.
 */
export interface RequestOptions<DataType = any> {
  data?: DataType
  headers?: any
  method?: RequestMethod
  params?: any
  url?: string
}

/**
 * Possible statuses for an in-flight request.
 */
export type RequestStatus = 'started' | 'success' | 'failure'

export const dataStore = createDataStore
export const middleware = createDataStoreMiddleware
