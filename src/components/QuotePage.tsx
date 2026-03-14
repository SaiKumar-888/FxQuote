import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuote } from '../hooks/useQuote'

export default function QuotePage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState(100)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [secondsLeft, setSecondsLeft] = useState(0)

  const {
    refetch: fetchQuote,
    error: errorFetchingQuote,
    data: dataFetchingQuote,
    isSuccess: isSuccessFetchingQuote,
    isError: isErrorFetchingQuote,
    isLoading: isLoadingFetchingQuote,
  } = useQuote({ amount, from, to })
  
  const quote = isSuccessFetchingQuote ? dataFetchingQuote : undefined
  const canGetQuote = amount > 0 && from !== to
  const isQuoteExpired = (quote && secondsLeft === 0)

  useEffect(() => {
    if (!quote || secondsLeft === 0) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [quote, secondsLeft])

  async function handleGetQuote() {
    console.log('cangetQuote', canGetQuote)
    if (!canGetQuote) return
    const result = await fetchQuote()
    if (!result.data) return

    const remainingSeconds = Math.max(
      0,
      Math.ceil((result.data.expiresAt - Date.now()) / 1000),
    )
    setSecondsLeft(remainingSeconds)
  }

  function handleContinue() {
    if (!quote || isQuoteExpired) return
    navigate('/confirm', { state: { quote } })
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:p-8">
      <h1 className="text-2xl font-semibold">FX Quote</h1>
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-medium">Get a quote</h2>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            Source currency
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-600">
            Destination currency
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-gray-600">
            Amount
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              type="number"
              value={amount}
              min={1}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleGetQuote}
            disabled={!canGetQuote || isLoadingFetchingQuote}
          >
            {isLoadingFetchingQuote ? 'Getting quote...' : 'Get Quote'}
          </button>
          {quote && (
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleGetQuote}
              disabled={isLoadingFetchingQuote}
            >
              Refresh Quote
            </button>
          )}
        </div>

        {isLoadingFetchingQuote && <p className="text-sm text-gray-600">Fetching quote Details..</p>}
        {isErrorFetchingQuote && (
          <p className="text-sm text-red-600">
            {errorFetchingQuote 
              ? errorFetchingQuote.message
              : 'Failed to fetch quote. Please try again.'}
          </p>
        )}

        {quote && (
          <div className="space-y-1 text-sm">
            <p>
              Rate: 1 {quote.from} = {quote.rate} {quote.to}
            </p>
            <p>
              Fees: {quote.fee} {quote.from}
            </p>
            <p>
              Total payable: {quote.totalPayable} {quote.from}
            </p>
            <p>
              You pay {quote.fromAmount} {quote.from} and receive {quote.toAmount} {quote.to}
            </p>
            <p>
              Expires in: <strong>{secondsLeft}s</strong>
            </p>
            {isQuoteExpired && (
              <p className="text-red-600">Quote expired. Please refresh quote.</p>
            )}
          </div>
        )}

        <button
          className="w-fit rounded-md bg-gray-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleContinue}
          disabled={!quote || isLoadingFetchingQuote || isQuoteExpired}
        >
          Continue
        </button>
      </div>
    </main>
  )
}
