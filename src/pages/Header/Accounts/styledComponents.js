import styled from 'styled-components'
import { VerticalContainer } from '../../../components/styled'

export const Name = styled.span`
  font-size: 13px;
  color: #3f3f3f;
  font-weight: 500;
`

export const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    cursor: pointer;
    border: none;
    background-color: unset;
  }

  .extension-tooltip {
    padding: 8px 10px !important;
  }

  .copy-icon {
    font-size: 12px;
    color: #f6c94a;
  }
`

export const ActiveFlagPlaceHolder = styled.div`
  border-radius: 2px;
  width: 4px;
  height: 62px;
`

export const ActiveFlag = styled(ActiveFlagPlaceHolder)`
  background-color: #f6c94a;
`

export const AccountDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  font-size: 12px;
  color: #8e9193;
  padding: 0 12px;
`

export const Accounts = styled(VerticalContainer)`
  padding-bottom: 10px;
`

export const Account = styled.div`
  display: flex;
  height: 62px;
  width: 100%;
  font-size: 12px;
  color: #8e9193;
  cursor: pointer;

  &:hover {
    background-color: #f2f3f4;
  }
`
