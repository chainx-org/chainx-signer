import React from 'react'
import { Container } from '../../components/styled'
import ErrorMessage from '../../components/ErrorMessage'
import { useSelector } from 'react-redux'
import { chainNameSelector } from '@store/reducers/settingSlice'

function NodeError() {
  const chainName = useSelector(chainNameSelector)

  return (
    <Container style={{ paddingTop: 20 }}>
      <ErrorMessage>
        {`Failed to init ${chainName} instance, please switch node and retry.`}
      </ErrorMessage>
    </Container>
  )
}

export default NodeError
