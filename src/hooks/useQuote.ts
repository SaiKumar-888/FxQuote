import { useQuery } from '@tanstack/react-query'
import { getQuote } from '../api/fxApi'

type Params = {
  amount: number
  from: string
  to: string
}

export function useQuote({ amount, from, to }: Params) {
  return useQuery({
    queryKey: ['quote', amount, from, to],
    queryFn: () => getQuote({ amount, from, to }),
    enabled: false,
  })
}
