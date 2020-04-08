import React, { useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import { addNode } from '../../store/reducers/nodeSlice'
import { networkSelector } from '../../store/reducers/settingSlice'
import { useDispatch, useSelector } from 'react-redux'
import getDelay from '../../shared/updateNodeStatus'
import { TextInput } from '@chainx/ui'
import {
  ButtonLine,
  Container,
  InputWrapper,
  Title
} from '../../components/styled'
import PrimaryButton from '@chainx/ui/dist/Button/PrimaryButton'
import InfoLabel from '../../components/InfoLabel'

function AddNode(props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const chainId = useSelector(networkSelector)
  const dispatch = useDispatch()

  const enter = () => {
    if (!name || !url) {
      setErrMsg('name and url are required')
      return
    }

    try {
      // TODO: 检查网络是否匹配
      dispatch(addNode({ chainId, node: { name, url } }))
      getDelay()
        .then(() => console.log('Delay info updated'))
        .catch(() => console.log('Failed to update delay info'))
      setErrMsg('')
      props.history.push('/')
    } catch (error) {
      setErrMsg(error.message)
    }
  }

  return (
    <Container>
      <Title>Add node</Title>
      <InputWrapper>
        <TextInput
          showClear={false}
          value={name}
          onChange={setName}
          placeholder="Name(12 characters max)"
        />
      </InputWrapper>
      <InputWrapper>
        <InfoLabel>Node address</InfoLabel>
        <TextInput
          showClear={false}
          value={url}
          onChange={setUrl}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              enter()
            }
          }}
          placeholder="wss://w1.chainx.org/ws"
        />
      </InputWrapper>
      <ButtonLine>
        <PrimaryButton size="large" onClick={() => enter()}>
          Confirm
        </PrimaryButton>
      </ButtonLine>
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </Container>
  )
}

export default AddNode
