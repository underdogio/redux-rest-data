// Middleware that converts request actions into fetch requests.
import { Store, Dispatch } from 'redux'
import axios from 'axios'

import { InitRequestAction, updateRequestStatus } from './actions'
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
    return (next: Dispatch) => (
      action: InitRequestAction<any> | InitAction
    ) => {
      if (action.type !== '@underdogio/redux-rest-data/init_request') {
        return next(action)
      }

      const { data, headers, id, method, url, storeName } = action

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
          data,
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
