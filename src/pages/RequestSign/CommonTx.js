import React from 'react'

export default function(props) {
  const { query } = props

  return (
    <div className="detail">
      <div className="detail-item">
        <span>Method</span>
        <span>{query.method.replace(/([A-Z])/g, '_$1').toLowerCase()}</span>
      </div>
      <div className="detail-item">
        <span>Args</span>
        <section className="args">
          <ol>
            {(query.argsWithName || []).map((arg, index) => {
              if (!arg) {
                return null
              }
              return (
                <li key={index}>
                  <span className="arg-name">{arg.name}: </span>
                  <span className="arg-value">
                    {arg.value.toString().length > 10000
                      ? '[object Object]'
                      : arg.value.toString()}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}
