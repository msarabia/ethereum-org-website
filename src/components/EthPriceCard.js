import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Mixins } from "./Theme"
import axios from "axios"

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 416px;
  max-height: 192px;
  background: ${(props) => props.theme.colors.priceCardBackground};
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.priceCardBorder};
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.text200};
`

const Price = styled.div`
  ${Mixins.textLevel1}
  margin: ${(props) => (props.hasError ? `1rem 0` : 0)};
  font-size: ${(props) => (props.hasError ? props.theme.fontSizes.m : `3rem`)};
  color: ${(props) =>
    props.hasError ? props.theme.colors.fail : props.theme.colors.text};
`

const ChangeContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 33px; /* prevents jump when price loads*/
`

const Change = styled.div`
  font-size: 24px;
  line-height: 140%;
  margin-right: 1rem;
  color: ${(props) =>
    props.isNegativeChange
      ? props.theme.colors.fail
      : props.theme.colors.success};
`

const ChangeTime = styled.div`
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.text300};
`

// TODO add info icon & tooltip
// TODO add prop to left vs. center align
const EthPriceCard = () => {
  const [state, setState] = useState({
    currentPriceUSD: "",
    priceChangeUSD: "",
    percentChangeUSD: "",
    errorMsg: "",
  })

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
      )
      .then((response) => {
        if (response.data && response.data.ethereum) {
          const currentPriceUSD = response.data.ethereum.usd
          const priceChangeUSD = response.data.ethereum.usd_24h_change
          const percentChangeUSD =
            Math.round(
              ((currentPriceUSD + priceChangeUSD) / currentPriceUSD) * 100
            ) / 100
          setState({
            currentPriceUSD,
            priceChangeUSD,
            percentChangeUSD,
          })
        }
      })
      .catch((error) => {
        console.error(error)
        setState({
          errorMsg: "Loading error. Try refreshing the page.",
        })
      })
  }, [])

  const isLoading = !state.currentPriceUSD

  let price = isLoading ? `Fetching price...` : `$${state.currentPriceUSD}`

  const hasError = !!state.errorMsg
  if (hasError) {
    price = state.errorMsg
  }

  const isNegativeChange = state.priceChangeUSD && state.priceChangeUSD < 0

  const change = state.percentChangeUSD
    ? isNegativeChange
      ? `${state.percentChangeUSD}% ↘`
      : `${state.percentChangeUSD}% ↗`
    : ``

  return (
    <Card>
      <Title>Current price</Title>
      <Price hasError={hasError}>{price}</Price>
      <ChangeContainer>
        <Change isNegativeChange={isNegativeChange}>{change}</Change>
        <ChangeTime>(1 Day)</ChangeTime>
      </ChangeContainer>
    </Card>
  )
}

export default EthPriceCard