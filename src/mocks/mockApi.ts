export type QuoteRequest = {
  amount: number
  from: string
  to: string
}

export type QuoteResponse = {
  rate: number
  fromAmount: number
  toAmount: number
  fee: number
  totalPayable: number
  expiresAt: number
  from: string
  to: string
}

export type PayRequest = {
  amount: number
  from: string
  to: string
}

export type PayResponse = {
  transactionId: string
  status: 'processing' | string
}

export type TransactionStatus = {
  transactionId: string
  status: 'processing' | 'sent' | 'settled' | 'failed'
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

const statusPollCount = new Map<string, number>()
const transactionOutcome = new Map<string, 'settled' | 'failed'>()

export async function mockGetQuote(payload: QuoteRequest): Promise<QuoteResponse> {
  await wait(500)

  const rate = payload.from === 'USD' && payload.to === 'INR' ? 83.1 : 1.07
  const fee = Number((payload.amount * 0.01).toFixed(2))

  return {
    rate,
    fromAmount: payload.amount,
    toAmount: Number((payload.amount * rate).toFixed(2)),
    fee,
    totalPayable: Number((payload.amount + fee).toFixed(2)),
    expiresAt: Date.now() + 30_000,
    from: payload.from,
    to: payload.to,
  }
}

export async function mockPay(payload: PayRequest): Promise<PayResponse> {
  await wait(800)
  const base = `${payload.from}-${payload.to}-${Date.now()}`
  const transactionId = `tx-${base}`
  //change the status to fail or success
  const finalStatus = Math.random() < 0.2 ? 'failed' : 'settled'
  transactionOutcome.set(transactionId, finalStatus)
  return { transactionId, status: 'processing' }
}

export async function mockGetTransactionStatus(
  transactionId: string,
): Promise<TransactionStatus> {
  await wait(600)
  const count = (statusPollCount.get(transactionId) ?? 0) + 1
  statusPollCount.set(transactionId, count)
  const finalStatus = transactionOutcome.get(transactionId) ?? 'settled'
  console.log(' transactionId:', transactionId, 'count:', count)
  console.log(' finalStatus:', finalStatus)
  console.log(' transactionOutcome:', transactionOutcome.get(transactionId))

  let status: TransactionStatus['status'] = 'processing'
  if (count >= 2) status = 'sent'
  if (count >= 3) status = finalStatus

  return {
    transactionId,
    status,
  }
}
