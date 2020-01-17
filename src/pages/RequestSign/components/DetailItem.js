import React from 'react'

export default function({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
