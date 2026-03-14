import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function RouteErrorFallback() {
  const error = useRouteError()

  let message = 'Something went wrong'
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`
  }

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-200 bg-red-50 p-4">
      <h2 className="text-lg font-medium text-red-700">Route Error</h2>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  )
}
