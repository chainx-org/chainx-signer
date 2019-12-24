import React, { useState } from 'react'
import { addChainxNode, removeChainxNode } from '../../messaging'
import ErrorMessage from '../../components/ErrorMessage'
import { useRedux, updateNodeStatus } from '../../shared'
import './nodeAction.scss'

function AddNode(props) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [, setCurrentNode] = useRedux('currentNode')
  const [{ isTestNet }] = useRedux('isTestNet')
  const [{ nodeList }, setNodeList] = useRedux('nodeList', [])
  const [{ delayList }, setDelayList] = useRedux('delayList', [])
  const [{ testDelayList }, setTestDelayList] = useRedux('testDelayList', [])
  const [, setCurrentDelay] = useRedux('currentDelay', 0)
  const [, setCurrentTestDelay] = useRedux('currentTestDelay', 0)

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

  const check = () => {
    if (!name || !url) {
      setErrMsg('name and url are required')
      return false
    }
    return true
  }

  const enter = async () => {
    if (!check()) {
      return
    }
    try {
      await addChainxNode(name, url, isTestNet)
      setErrMsg('')
      await updateNodeStatus(
        setCurrentNode,
        isTestNet ? setCurrentTestDelay : setCurrentDelay,
        setNodeList,
        isTestNet ? testDelayList : delayList,
        isTestNet ? setTestDelayList : setDelayList,
        isTestNet
      )
      props.history.push('/')
    } catch (error) {
      setErrMsg(error.message)
    }
  }

  const deleteNode = async (name: string, url: string) => {
    if (nodeList.length < 2) {
      setErrMsg('can not remove the last node')
      return
    }
    try {
      await removeChainxNode(name, url, isTestNet)
      setErrMsg('')
      await updateNodeStatus(
        setCurrentNode,
        isTestNet ? setCurrentTestDelay : setCurrentDelay,
        setNodeList,
        isTestNet ? testDelayList : delayList,
        isTestNet ? setTestDelayList : setDelayList,
        isTestNet
      )
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
          <input
            className="input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name(12 characters max)"
          />
          <span className="node-url">Node address</span>
          <input
            className="input"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
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
