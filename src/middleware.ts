// Middleware that converts request actions into fetch requests.
import { Store, Dispatch } from 'redux'
import { RequestAction, updateRequestStatus } from './actions'
import {
  InitAction,
  MiddlewareOptions,
  RequestOptions,
  RequestResponse
} from '.'
import { trim } from './util'

const defaultSerializer = (params: RequestOptions['params']): string => {
  return Object.keys(params)
    .map(name => `${name}=${params[name]}`)
    .join('&')
}

export function createMiddleware(options: MiddlewareOptions) {
  return function dataStoreMiddleware(store: Store) {
    return (next: Dispatch) => (action: RequestAction<any> | InitAction) => {
      if (action.type !== '@underdogio/redux-rest-data/request') {
        return next(action)
      }

      const { id, storeName, requestOptions } = action
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
        let params

        if (requestOptions.params) {
          params = options.serializeParams
            ? options.serializeParams(requestOptions.params)
            : defaultSerializer(requestOptions.params)
        }

        let path = params
          ? `${requestOptions.url}?${params}`
          : requestOptions.url

        const url = `${trim(options.baseUrl, '/')}/${trim(path, '/')}`

        const opts: RequestInit = {
          method: requestOptions.method,
          headers: {
            ...(options.requestOptions && options.requestOptions.headers
              ? options.requestOptions.headers
              : {}),
            ...requestOptions.headers
          },
          credentials: 'same-origin'
        }

        fetch(url, opts)
          .then(async response => {
            const body = await response.text()

            let result: RequestResponse = {
              data: body,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            }

            if (response.status >= 400) {
              handleFailure({
                status: response.status,
                message: body
              })
            } else {
              result.data = JSON.parse(body)

              const data =
                typeof options.transformResponse === 'function'
                  ? options.transformResponse(result)
                  : result.data

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
            resolve(result)
          })
          .catch(error => {
            handleFailure(error)
            reject(error)
          })
      })
    }
  }
}
