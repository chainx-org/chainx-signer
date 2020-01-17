import React from 'react'

export default function({ value, token }) {
  return (
    <div className="detail-amount">
      <span>Amount</span>
      <span>
        {value} {token}
      </span>
    </div>
  )
}
