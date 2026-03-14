/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Loader } from './shared/components/Loader'
import { RouteErrorFallback } from './shared/components/RouteErrorFallback'

const QuotePage = React.lazy(() => import('./components/QuotePage'))
const ConfirmPage = React.lazy(() => import('./components/ConfirmPage'))
const StatusPage = React.lazy(() => import('./components/StatusPage'))

export const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <QuotePage />
      </Suspense>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/quote',
    element: (
      <Suspense fallback={<Loader />}>
        <QuotePage />
      </Suspense>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/confirm',
    element: (
      <Suspense fallback={<Loader />}>
        <ConfirmPage />
      </Suspense>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/status',
    element: (
      <Suspense fallback={<Loader />}>
        <StatusPage />
      </Suspense>
    ),
    errorElement: <RouteErrorFallback />,
  },
])
