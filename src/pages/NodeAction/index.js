import React, { useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import {
  addNode,
  chainxNodesSelector,
  removeNode
} from '../../store/reducers/nodeSlice'
import { networkSelector } from '../../store/reducers/settingSlice'
import { useDispatch, useSelector } from 'react-redux'
import './nodeAction.scss'
import getDelay from '../../shared/updateNodeStatus'
import { TextInput } from '@chainx/ui'
import { ButtonLine, InputWrapper, Title } from '../../components/styled'
import PrimaryButton from '@chainx/ui/dist/Button/PrimaryButton'

function AddNode(props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const nodeList = useSelector(chainxNodesSelector)
  const chainId = useSelector(networkSelector)
  const dispatch = useDispatch()

  const {
    location: { query }
  } = props

  console.log('props', props)
  console.log('query', query)

  let action = ''
  let title = 'Add node'
  if (query && query.type === 'edit') {
    action = 'edit'
    title = 'Edit node'
  } else if (query && query.type === 'remove') {
    action = 'remove'
    title = 'Delete node'
  }

  console.log('action', action)

  const enter = () => {
    if (!name || !url) {
      setErrMsg('name and url are required')
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

  const deleteNode = async (name, url) => {
    if (nodeList.length < 2) {
      setErrMsg('can not remove the last node')
      return
    }
    try {
      dispatch(removeNode({ chainId, url }))
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
    <div className="node-action">
      <Title>{title}</Title>
      {action !== 'remove' ? (
        <>
          <InputWrapper>
            <TextInput
              showClear={false}
              value={name}
              onChange={setName}
              placeholder="Name(12 characters max)"
            />
          </InputWrapper>
          <span className="node-url">Node address</span>
          <InputWrapper>
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
        </>
      ) : (
        <ButtonLine>
          <PrimaryButton
            size="large"
            onClick={() => {
              deleteNode(query.nodeInfo.name, query.nodeInfo.url)
            }}
          >
            Delete
          </PrimaryButton>
        </ButtonLine>
      )}
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  )
}

export default AddNode
