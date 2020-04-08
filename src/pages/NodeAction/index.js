import React, { useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import { addNode } from '../../store/reducers/nodeSlice'
import {
  isTestNetSelector,
  networkSelector
} from '../../store/reducers/settingSlice'
import { useDispatch, useSelector } from 'react-redux'
import getDelay from '../../shared/updateNodeStatus'
import { TextInput } from '@chainx/ui'
import {
  ButtonLine,
  Container,
  InputWrapper,
  SubTitle,
  Title
} from '../../components/styled'
import PrimaryButton from '@chainx/ui/dist/Button/PrimaryButton'
import InfoLabel from '../../components/InfoLabel'
import { sleep } from '../../shared'

function AddNode(props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const chainId = useSelector(networkSelector)
  const dispatch = useDispatch()
  const isTestNet = useSelector(isTestNetSelector)

  const requestChainInfo = url => {
    const id = Number(
      Date.now() +
        Math.random()
          .toString()
          .substr(2, 3)
    ).toString(36)

    const requestMsg = JSON.stringify({
      id,
      jsonrpc: '2.0',
      method: 'system_properties',
      params: []
    })

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        ws.send(requestMsg)
      }

      ws.onmessage = res => {
        const data = JSON.parse(res.data)
        if (data.id !== id) {
          return
        }

        resolve({ data: data.result })
        ws.close()
      }

      ws.onerror = err => {
        reject({ err })
        ws.close()
      }
    })
  }

  const enter = async () => {
    if (!name || !url) {
      setErrMsg('name and url are required')
      return
    }

    try {
      const result = await Promise.race([requestChainInfo(url), sleep(10000)])
      if (!result) {
        setErrMsg('Fetch node properties timeout')
        return
      }

      const { network_type: network } = result || {}
      if (
        (!isTestNet && network !== 'mainnet') ||
        (isTestNet && network !== 'testnet')
      ) {
        setErrMsg('Node has invalid network')
        return
      }
    } catch (e) {
      setErrMsg('Can not connect the node')
      return
    }

    try {
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
      <SubTitle>
        Please add node for ChainX {isTestNet ? 'testnet' : 'mainnet'}
      </SubTitle>
      <InputWrapper>
        <TextInput
          showClear={false}
          value={name}
          onChange={v => {
            setErrMsg(null)
            setName(v)
          }}
          placeholder="Name(12 characters max)"
        />
      </InputWrapper>
      <InputWrapper>
        <InfoLabel>Node address</InfoLabel>
        <TextInput
          showClear={false}
          value={url}
          onChange={v => {
            setErrMsg(null)
            setUrl(v)
          }}
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
      {errMsg && <ErrorMessage>{errMsg}</ErrorMessage>}
    </Container>
  )
}

export default AddNode
