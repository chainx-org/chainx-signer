import styled from 'styled-components'

export const NativeAssetWrapper = styled.div`
  padding: 32px 0;
  border-top: 1px solid #dce0e2;

  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    margin-top: 16px;
    font-size: 12px;
    color: #8e9193;
    text-align: center;
    line-height: 1;
  }

  p {
    font-size: 20px;
    color: #3f3f3f;
    margin: 8px 0 0;
  }
`

export const OtherAssetsWrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid #dce0e2;
    span {
      font-weight: bold;
      font-size: 14px;
      color: #3f3f3f;
      text-align: right;
      line-height: 20px;
    }
  }
`
