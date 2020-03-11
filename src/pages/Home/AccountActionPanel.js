import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import { useHistory } from 'react-router'
import { setShowAccountAction } from '../../store/reducers/statusSlice'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  border: 1px solid #dce0e2;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 140px;
  justify-content: space-around;
  font-size: 14px;
  background-color: #fff;

  span {
    cursor: pointer;
    padding: 10px 0 10px 20px;
    &:hover {
      background-color: #f2f3f4;
    }
  }
`

export default function() {
  const currentAccount = useSelector(currentChainxAccountSelector)
  const history = useHistory()
  const dispatch = useDispatch()

  function operateAccount(type) {
    if (currentAccount.address) {
      history.push({
        pathname: '/enterPassword',
        query: {
          type: type
        }
      })
    }
    dispatch(setShowAccountAction(false))
  }

  return (
    <Wrapper>
      <span onClick={() => operateAccount('export')}>Export PrivateKey</span>
      <span onClick={() => operateAccount('remove')}>Forget Account</span>
    </Wrapper>
  )
}
