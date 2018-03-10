import * as _ from 'lodash'

export const buildRecoveryTimes = (): string[] => {
  const numbers = _.range(0, 600, 15)
  return numbers.map((n: number) => {
    const minutes = Math.floor(n / 60)
    const seconds = n % 60
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  })
}