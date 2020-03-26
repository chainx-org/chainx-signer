import React from 'react'
import { DefaultButton, Drawer, PrimaryButton } from '@chainx/ui'
import styled from 'styled-components'
import { nonFunc } from '../../utils'

const Wrapper = styled.div`
  padding: 20px;

  & > button:not(:first-of-type) {
    margin-top: 16px;
  }
`

const Title = styled.h3`
  margin: 0 0 20px;
  opacity: 0.72;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.12px;
  text-align: center;
  line-height: 20px;
`

export default function RemoveAccountConfirm({
  text,
  open,
  closeMenu = nonFunc,
  ok = nonFunc
}) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      style={{ padding: 20 }}
      onClose={closeMenu}
    >
      <Wrapper>
        <Title>{text}</Title>
        <PrimaryButton size="fullWidth" onClick={ok}>
          OK
        </PrimaryButton>
        <DefaultButton size="fullWidth" onClick={closeMenu}>
          Cancel
        </DefaultButton>
      </Wrapper>
    </Drawer>
  )
}
