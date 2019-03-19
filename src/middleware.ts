// Middleware that converts request actions into fetch requests.
import { Store, Dispatch } from 'redux'
import axios from 'axios'

import { RequestAction, updateRequestStatus } from './actions'
import { InitAction } from '.'
import { trim } from './util'

interface MiddlewareOptions {
  baseUrl?: string
}

/**
 *
 */
export function createDataStoreMiddleware(options: MiddlewareOptions) {
  const client = axios.create({
    baseURL: trim(options.baseUrl, '/')
  })

  return function dataStoreMiddleware(store: Store) {
    return (next: Dispatch) => (action: RequestAction<any> | InitAction) => {
      if (action.type !== '@underdogio/redux-rest-data/request') {
        return next(action)
      }

      const { type, id, storeName, requestOptions } = action
      const { method } = requestOptions

      store.dispatch(
        updateRequestStatus({
          storeName,
          id,
          method,
          status: 'started'
        })
      )

      return new Promise(function requestPromise(resolve, reject) {
        client(requestOptions)
          .then(response => {
            if (response.status >= 400) {
              throw response
            }

            store.dispatch(
              updateRequestStatus({
                storeName,
                id,
                data: response.data,
                status: 'success',
                method
              })
            )

            resolve(response)
          })
          .catch(error => {
            store.dispatch(
              updateRequestStatus({
                storeName,
                id,
                error,
                status: 'failure',
                method
              })
            )

            reject(error)
          })
      })
    }
  }
}
