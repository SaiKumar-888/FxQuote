import { useQuery } from '@tanstack/react-query'
import { getTransactionStatus } from '../api/fxApi'

export function useTransactionStatus(transactionId: string | null) {
  return useQuery({
    queryKey: ['transaction-status', transactionId],
    queryFn: () => getTransactionStatus(transactionId as string),
    enabled: Boolean(transactionId),
    refetchInterval: (query) =>
      query.state.data?.status === 'settled' || query.state.data?.status === 'failed'
        ? false
        : 2000,
  })
}
