import React, { useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import {
  chainxNodesSelector,
  addNode,
  removeNode,
  setNodeDelay
} from '../../store/reducers/nodeSlice'
import { networkSelector } from '../../store/reducers/settingSlice'
import { useSelector, useDispatch } from 'react-redux'
import './nodeAction.scss'
import getDelay from '../../shared/updateNodeStatus'
import { TextInput } from '@chainx/ui'

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

  let action = ''
  let title = 'Add node'
  if (query && query.type === 'edit') {
    action = 'edit'
    title = 'Edit node'
  } else if (query && query.type === 'remove') {
    action = 'remove'
    title = 'Delete node'
  }

  const enter = async () => {
    if (!name || !url) {
      setErrMsg('name and url are required')
      return
    }

    try {
      dispatch(addNode({ chainId, node: { name, url } }))
      getDelay(nodeList, chainId, dispatch, setNodeDelay)
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
      getDelay(nodeList, chainId, dispatch, setNodeDelay)
      setErrMsg('')
      props.history.push('/')
    } catch (error) {
      setErrMsg(error.message)
    }
  }

  return (
    <div className="node-action">
      <span className="title">{title}</span>
      {action !== 'remove' ? (
        <>
          <TextInput
            showClear={false}
            className="fixed-width"
            value={name}
            onChange={setName}
            placeholder="Name(12 characters max)"
          />
          <span className="node-url">Node address</span>
          <TextInput
            showClear={false}
            className="fixed-width"
            value={url}
            onChange={setUrl}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                enter()
              }
            }}
            placeholder="wss://w1.chainx.org/ws"
          />
          <button
            className="button button-yellow margin-top-40"
            onClick={() => enter()}
          >
            Confirm
          </button>
        </>
      ) : (
        <button
          className="button button-white margin-top-16"
          onClick={() => {
            deleteNode(query.nodeInfo.name, query.nodeInfo.url)
          }}
        >
          Delete
        </button>
      )}
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  )
}

export default AddNode
