// Middleware that converts request actions into fetch requests.
import { Store, Dispatch } from 'redux'
import { RequestAction, updateRequestStatus } from './actions'
import { InitAction, MiddlewareOptions, RequestOptions } from '.'

const defaultSerializer = (params: RequestOptions['params']): string => {
  return Object.keys(params)
    .reduce((acc, next) => [...acc, `${next}=${params[next]}`], [])
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

        const url = new URL(path, options.baseUrl)

        const opts: RequestInit = {
          method: requestOptions.method,
          headers: requestOptions.headers,
          credentials: 'same-origin'
        }

        /*         if (requestOptions.data) {
          opts.body = JSON.stringify(requestOptions.data)
        } */

        fetch(url.toString(), opts)
          .then(async response => {
            const body = await response.text()

            if (response.status >= 400) {
              handleFailure({
                status: response.status,
                message: body
              })
            } else {
              const json = JSON.parse(body)
              const data =
                typeof options.transformResponse === 'function'
                  ? options.transformResponse(json)
                  : json.data

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
