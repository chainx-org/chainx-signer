import { getDelayClass } from './utils'
import React from 'react'

export default function({ delay }) {
  function getDelayText(delay) {
    if (delay > 1000) {
      return `${(delay / 1000).toFixed(1)} s`
    }

    return `${delay} ms`
  }

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
          getDelayText(delay)
        }
      }}
    </span>
  )
}
