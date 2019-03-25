// Middleware that converts request actions into fetch requests.
import { Store, Dispatch } from 'redux'
import axios, { AxiosResponse } from 'axios'

import { RequestAction, updateRequestStatus } from './actions'
import { InitAction, MiddlewareOptions } from '.'
import { trim } from './util'

/**
 *
 */
export function createMiddleware(options: MiddlewareOptions) {
  const client = axios.create({
    baseURL: trim(options.baseUrl, '/'),
    ...options.requestOptions
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

      // Handle when we did not get a success response code.
      const handleFailure = (error: any) => {
        store.dispatch(
          updateRequestStatus({
            storeName,
            id,
            error,
            status: 'failure',
            method
          })
        )
      }

      return new Promise(function requestPromise(resolve, reject) {
        client({
          withCredentials: true,
          ...requestOptions
        })
          .then(response => {
            if (response.status >= 400) {
              handleFailure(response)
            } else {
              const data =
                typeof options.transformResponse === 'function'
                  ? options.transformResponse(response)
                  : response.data

              store.dispatch(
                updateRequestStatus({
                  storeName,
                  id,
                  data,
                  status: 'success',
                  method
                })
              )
            }

            // Always resolve with response.
            resolve(response)
          })
          .catch(error => {
            handleFailure(error)
            reject(error)
          })
      })
    }
  }
}
