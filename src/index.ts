import { createDataStore } from './data-store'
import { createMiddleware } from './middleware'

export interface RequestResponse {
  data: any
  status: number
  statusText: string
  headers: any
}

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

export interface MiddlewareOptions {
  /**
   * The base url for all requests.
   */
  baseUrl?: string

  /**
   * Default options for all requests.
   */
  requestOptions?: Partial<Pick<RequestOptions, 'headers' | 'params'>>

  /**
   * Function for transforming the data from a response to match a desired format.
   */
  transformResponse?: (response: RequestResponse) => any

  /**
   * Function for serializing `requestOptions.params` from an object to a string.
   */
  serializeParams?: (params: any) => string
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

export interface DataStoreOptions {
  /**
   * The base url for all requests made for items in this data store.
   * This is NOT the same as specifying domain. This is handled in middleware.
   */
  baseUrl: string

  /**
   * The name of this data store. Should be unique for an entire Redux store.
   */
  storeName: StoreName
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
  data?: Partial<DataType>
  headers?: any
  method?: RequestMethod
  params?: any
  url?: string
}

/**
 * Possible statuses for an in-flight request.
 */
export type RequestStatus = 'started' | 'success' | 'failure'

export { createDataStore }
export { createMiddleware as middleware }
