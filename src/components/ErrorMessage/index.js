import React from 'react'
import './index.scss'

function ErrorMessage(props) {
  const { msg } = props

  return (
    <div className="error-message">
      <span>{msg}</span>
    </div>
  )
}

export default ErrorMessage
