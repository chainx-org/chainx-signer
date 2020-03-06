import { getDelayClass } from './utils'
import React from 'react'

export default function({ delay }) {
  return (
    <span className={getDelayClass(delay)}>
      {do {
        if (!delay) {
          // eslint-disable-next-line no-unused-expressions
          ;('')
        } else if (delay === 'timeout') {
          // eslint-disable-next-line no-unused-expressions
          ;('timeout')
        } else {
          // eslint-disable-next-line no-unused-expressions
          ;`${delay} ms`
        }
      }}
    </span>
  )
}
