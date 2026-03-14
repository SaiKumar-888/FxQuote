import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTransactionStatus } from '../hooks/useTransactionStatus'

type StatusState = {
  transactionId?: string
}

export default function StatusPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as StatusState | null
  const transactionId = state?.transactionId ?? null

  const {
    error: errorFetchingStatus,
    data: dataFetchingStatus,
    isSuccess: isSuccessFetchingStatus,
    isError: isErrorFetchingStatus,
    isLoading: isLoadingFetchingStatus,
  } = useTransactionStatus(transactionId)
  const status = dataFetchingStatus?.status

  useEffect(() => {
    if (!transactionId) {
      navigate('/quote', { replace: true })
    }
  }, [transactionId, navigate])

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:p-8">
      <h1 className="text-2xl font-semibold">FX Quote</h1>
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-medium">Transaction status</h2>
        {isLoadingFetchingStatus && (
          <p className="text-sm text-gray-600">Checking transaction status...</p>
        )}
        {isErrorFetchingStatus && (
          <p className="text-sm text-red-600">
            {errorFetchingStatus instanceof Error
              ? errorFetchingStatus.message
              : 'Failed to fetch status. Please try again.'}
          </p>
        )}
        {isSuccessFetchingStatus && dataFetchingStatus && (
          <>
            <p className="text-sm">Transaction: {dataFetchingStatus.transactionId}</p>
            <p className="text-sm">
              Status:{' '}
              <span className="font-medium">
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}
              </span>
            </p>
          </>
        )}
        {status === 'failed' && (
          <div
            className="w-fit rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 cursor-pointer"
            onClick={() => {
              console.log('Contact support clicked');
            }}
          >
            Contact support
          </div>
        )}
        <button
          className="w-fit rounded-md bg-gray-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => navigate('/quote', { replace: true })}
          disabled={isLoadingFetchingStatus}
        >
          Home
        </button>
      </div>
    </main>
  )
}
