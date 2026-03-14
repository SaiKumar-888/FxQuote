import {
  mockGetQuote,
  mockGetTransactionStatus,
  mockPay,
  type PayRequest,
  type PayResponse,
  type QuoteRequest,
  type QuoteResponse,
  type TransactionStatus,
} from '../mocks/mockApi'

export async function getQuote(payload: QuoteRequest): Promise<QuoteResponse> {
  const response = await mockGetQuote(payload)
  console.log('getQuote response:', response)
  return response
}

export async function pay(payload: PayRequest): Promise<PayResponse> {
  const response = await mockPay(payload)
  console.log(' pay response:', response)
  return response
}

export async function getTransactionStatus(
  transactionId: string,
): Promise<TransactionStatus> {
  const response = await mockGetTransactionStatus(transactionId)
  console.log(' getTransactionStatus response:', response)
  return response
}

export type { QuoteRequest, QuoteResponse, PayRequest, PayResponse, TransactionStatus }
