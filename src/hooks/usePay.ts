import { useMutation } from '@tanstack/react-query'
import { pay } from '../api/fxApi'

export function usePay() {
  return useMutation({
    mutationFn: pay,
  })
}
