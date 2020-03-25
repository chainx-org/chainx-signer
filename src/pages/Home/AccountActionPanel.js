import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainxAccountSelector } from '../../store/reducers/accountSlice'
import { useHistory } from 'react-router'
import { setShowAccountAction } from '../../store/reducers/statusSlice'
import styled from 'styled-components'
import { paths } from '../../constants'

const Wrapper = styled.ul`
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
  list-style: none;
  margin: 0;
  padding: 0;

  li {
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

  function goToPage(url) {
    if (currentAccount.address) {
      history.push(url)
    }
    dispatch(setShowAccountAction(false))
  }

  return (
    <Wrapper>
      <li onClick={() => goToPage(paths.showPrivateKey)}>Export PrivateKey</li>
      <li onClick={() => goToPage(paths.exportKeystore)}>Export Keystore</li>
      <li onClick={() => goToPage(paths.removeAccount)}>Forget Account</li>
    </Wrapper>
  )
}
