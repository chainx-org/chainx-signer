import React from 'react'
import { Container } from '../../components/styled'
import ErrorMessage from '../../components/ErrorMessage'

function NodeError() {
  return (
    <Container style={{ paddingTop: 20 }}>
      <ErrorMessage>
        Failed to init ChainX instance, please switch node and retry.
      </ErrorMessage>
    </Container>
  )
}

export default NodeError
