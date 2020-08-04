import chainx2Logo from '@assets/chainx2-logo.svg'
import chainxLogo from '@assets/svg/PCX.svg'
import React from 'react'
import styled from 'styled-components'
import { WhiteButton } from '@chainx/ui'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setShowImportMenu } from '../../store/reducers/statusSlice'
import { CHAINX2_TEST } from '@store/reducers/constants'
import { networkSelector } from '@store/reducers/settingSlice'

const Wrapper = styled.div`
  padding: 60px 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`

export default React.memo(function() {
  const history = useHistory()
  const dispatch = useDispatch()
  const chainId = useSelector(networkSelector)
  const logo = [CHAINX2_TEST].includes(chainId) ? chainx2Logo : chainxLogo

  return (
    <Wrapper>
      <img src={logo} alt="logo" width="90" height="90" />
      <WhiteButton
        size="fullWidth"
        style={{ marginTop: 40 }}
        onClick={() => history.push('/createAccount')}
      >
        New Account
      </WhiteButton>
      <WhiteButton
        size="fullWidth"
        style={{ marginTop: 16 }}
        onClick={() => dispatch(setShowImportMenu(true))}
      >
        Import Account
      </WhiteButton>
    </Wrapper>
  )
})
