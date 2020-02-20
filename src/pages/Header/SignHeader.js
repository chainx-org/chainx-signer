import React from 'react'

export default function({ history }) {
  return (
    <div className="center-title">
      <span>
        {((history.location.query && history.location.query.method) || '')
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase() || 'Sign Request'}
      </span>
    </div>
  )
}
