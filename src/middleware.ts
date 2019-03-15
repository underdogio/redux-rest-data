// Middleware that converts request actions into fetch requests.
import { Store, Dispatch } from 'redux'
import axios from 'axios'

import { InitRequestAction, updateRequestStatus } from './actions'
import { InitAction } from '.'

interface MiddlewareOptions {
  baseUrl?: string
}

/**
 *
 */
export function createDataStoreMiddleware(options: MiddlewareOptions) {
  const client = axios.create({
    baseURL: options.baseUrl
  })

  return function dataStoreMiddleware(store: Store) {
    return (next: Dispatch) => (action: InitRequestAction | InitAction) => {
      if (action.type !== '@underdogio/redux-rest-data/init_request') {
        return next(action)
      }

      const { headers, id, method, url, storeName } = action

      store.dispatch(
        updateRequestStatus({
          storeName,
          id,
          method,
          status: 'started'
        })
      )

      return new Promise(function requestPromise(resolve, reject) {
        client({
          headers,
          method,
          url
        })
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
