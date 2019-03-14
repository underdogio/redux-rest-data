// Middleware that converts request actions into fetch requests.
import { Store, Dispatch, Action } from 'redux'

import axios from 'axios'

/**
 *
 */
export function createDataStoreMiddleware(options) {
  const client = axios.create({
    baseURL: options.baseUrl
  })

  return function dataStoreMiddleware(store: Store) {
    return (next: Dispatch) => (action: any) => {
      if (action.type !== 'init_request') {
        return next(action)
      }

      const { headers, id, method = 'get', url, storeName } = action

      store.dispatch({
        type: '@underdogio/redux-rest-data/request',
        id,
        method,
        status: 'start'
      })

      client({
        headers,
        method,
        url
      })
        .then(response => {
          if (response.status >= 400) {
            throw response
          }

          store.dispatch({
            type: '@underdogio/redux-rest-data/request',
            id,
            data: response.data,
            method,
            status: 'success'
          })
        })
        .catch(error => {
          store.dispatch({
            type: '@underdogio/redux-rest-data/request',
            error,
            id,
            method,
            status: 'failure'
          })
        })
    }
  }
}
