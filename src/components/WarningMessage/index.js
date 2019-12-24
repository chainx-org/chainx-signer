import React from 'react'
import './index.scss'

export default function(props) {
  const { msg } = props

  return (
    <div className="warning-message">
      <span>{msg}</span>
    </div>
  )
}
