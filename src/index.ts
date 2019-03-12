export type ItemId = string
export type StoreName = string

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
