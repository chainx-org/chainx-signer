import React, { useState } from 'react'
import Confirm from '../Drawers/Confirm'
import { chainxNodesSelector, removeNode } from '../../store/reducers/nodeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { networkSelector } from '../../store/reducers/settingSlice'
import { useHistory, useLocation } from 'react-router'
import { ButtonLine, Container, SubTitle, Title } from '../../components/styled'
import PrimaryButton from '@chainx/ui/dist/Button/PrimaryButton'
import ErrorMessage from '../../components/ErrorMessage'

export default function() {
  const [errMsg, setErrMsg] = useState('')
  const nodeList = useSelector(chainxNodesSelector)
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const history = useHistory()
  const [showConfirm, setShowConfirm] = useState(false)

  const { query: { url } = {} } = useLocation()

  const deleteNode = () => {
    dispatch(removeNode({ chainId, url }))
    history.push('/')
  }

  const check = () => {
    if (nodeList.length < 2) {
      setErrMsg('can not remove the last node')
    } else {
      setShowConfirm(true)
    }
  }

  return (
    <>
      <Container>
        <Title>Delete Node</Title>
        <SubTitle>{url}</SubTitle>
        {errMsg && <ErrorMessage msg={errMsg} />}

        <ButtonLine>
          <PrimaryButton size="large" onClick={check}>
            Delete
          </PrimaryButton>
        </ButtonLine>
      </Container>

      <Confirm
        text={'Sure to delete account?'}
        open={showConfirm}
        closeMenu={() => setShowConfirm(false)}
        ok={deleteNode}
      />
    </>
  )
}
