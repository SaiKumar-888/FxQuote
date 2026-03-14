import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { QuoteResponse } from '../api/fxApi'
import { usePay } from '../hooks/usePay'

type ConfirmState = {
  quote?: QuoteResponse
}

export default function ConfirmPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ConfirmState | null
  const quote = state?.quote
  const {
    mutate: submitPayment,
    error: errorSubmittingPayment,
    data: dataSubmittingPayment,
    isSuccess: isSuccessSubmittingPayment,
    isError: isErrorSubmittingPayment,
    isPending: isPendingSubmittingPayment,
  } = usePay()

  useEffect(() => {
    if (!quote) {
      navigate('/quote', { replace: true })
    }
  }, [quote, navigate])

  useEffect(() => {
    if (!isSuccessSubmittingPayment || !dataSubmittingPayment) return
    navigate('/status', { state: { transactionId: dataSubmittingPayment.transactionId } })
  }, [dataSubmittingPayment, isSuccessSubmittingPayment, navigate])

  function handlePay() {
    if (!quote) return

    submitPayment({
      amount: quote.fromAmount,
      from: quote.from,
      to: quote.to,
    })
  }

  if (!quote) return null

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:p-8">
      <h1 className="text-2xl font-semibold">FX Quote</h1>
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-medium">Confirm payment</h2>
        <p className="text-sm">
          Send {quote.fromAmount} {quote.from}
        </p>
        <p className="text-sm">
          Recipient gets {quote.toAmount} {quote.to}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            onClick={() => navigate('/quote')}
          >
            Back
          </button>
          <button
            className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handlePay}
            disabled={isPendingSubmittingPayment}
          >
            {isPendingSubmittingPayment ? 'Processing...' : 'Pay now'}
          </button>
        </div>
        {isErrorSubmittingPayment && (
          <p className="text-sm text-red-600">
            {errorSubmittingPayment 
              ? errorSubmittingPayment.message
              : 'Payment failed. Please try again.'}
          </p>
        )}
      </div>
    </main>
  )
}
