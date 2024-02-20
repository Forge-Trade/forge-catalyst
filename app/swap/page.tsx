"use client"
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useCallback, useRef } from 'react'
import { Sidebar } from "@/components/sidebar"
import { Grid, Col, Text, Metric } from "@tremor/react";
import shortenENS, { formatDollarAmount, formatAmount } from "@/lib/helpers"
import { CardContent, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Iframe from "@/components/iframe"
import { Separator } from "@/components/ui/separator";
import { Title, AreaChart, BadgeDelta, Flex, DeltaType } from "@tremor/react";
import Link from "next/link";
import { Currency, TradeType, DialogAnimationType, Field, SwapWidget, Theme, SwapEventHandlers, SwapTransactionInfo } from '@forge-trade/widgets'
import { Trade } from '@forge-trade/router-sdk'
import DayOverview from './daydatas/overview'
import { gql } from '../grafbase'

class InterfaceTrade extends Trade<Currency, Currency, TradeType> {
  // No additional properties or methods
}
const debounceDelay = 500; // Adjust the delay as needed

import '@forge-trade/widgets/fonts.css'
interface TokenPrice {
  token: string;
  price: number;
}

async function getCandles(poolAddr: string) {
  try {
    const res = await fetch(`https://api.geckoterminal.com/api/v2/networks/evmos/pools/${poolAddr}/ohlcv/hour?aggregate=1&limit=360&currency=usd&token=base
    `, { next: { revalidate: 300 } })
    const data = await res.json();

    // If there's an error field in the response, return the address
    if (data.error) {
      return "";
    }
    return data;
  } catch (error) {
    // If there's an error in the fetch operation, return the address
    return "";
  }
}
async function getTopPools(address: string) {
  try {
    const res = await fetch(`https://api.geckoterminal.com/api/v2/networks/evmos/tokens/${address}?include=top_pools`, { next: { revalidate: 3600 } })
    const data = await res.json();
    if (data.error) {
      return "";
    }
    return data.relationships.top_pools.data[0].id;
  } catch (error) {
    // If there's an error in the fetch operation, return the address
    return "";
  }
}

async function getTokenHourly(token: string, limit: number = 720, tag: string) {

  const query = `query GetTokenHourly($token: String!, $limit: Int!) {
    forge {
      tokenHourDatas(
        subgraphError: allow
        where: { token: $token }
        first: $limit
        orderBy: periodStartUnix
        orderDirection: desc
      ) {
        periodStartUnix
        open
        high
        low
        close
        priceUSD
        totalValueLockedUSD
        volumeUSD
      }
    }
  }`;
  const variables = { token, limit };
  try {
    const data = await gql(query, variables, tag);
    // If there's an error field in the response, return the address
    if (data.error) {
      console.error(data.error)
      return "";
    }
    console.log(data)
    // Otherwise, return the name
    return data;
  } catch (error) {
    console.error(error)
    // If there's an error in the fetch operation, return the address
    return "";
  }
}
interface TokenHourData {
  periodStartUnix: number;
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: number;
  priceUSD: string;
  totalValueLockedUSD: string;
  volumeUSD: string;
}
interface TokenPrice {
  token: string;
  price: number;
}

async function fetchPrice(): Promise<any> {
  try {
    const res = await fetch('https://api.geckoterminal.com/api/v2/networks/evmos/pools/0xfe13390c6a6f01e80e9e4c38de079155e8c48978/ohlcv/hour?aggregate=1&limit=180&currency=usd&token=quote', { next: { revalidate: 300 } })
    if (!res.ok) {
      return []; // Return an empty array if fetch fails
    }
    const data = await res.json();
    const tokenPrices = data.data.attributes.ohlcv_list
    return (tokenPrices)
  } catch (error) {
    console.log(error);
    return []; // Return an empty object if an error occurs
  }
}
export default function Swap() {
  const [selectedToken, setSelectedToken] = useState<Currency | null>(null);
  const inputToken = useRef<[string, string, string] | ["", "", ""]>(["0xd4949664cd82660aae99bedc034a0dea8a0bd517", "EVMOS", "Wrapped Evmos"])
  const [tokenAddr, setTokenAddr] = useState("0xd4949664cd82660aae99bedc034a0dea8a0bd517");
  const [poolAddr, setPoolAddr] = useState("");
  const [tradeQuote, setTradeQuote] = useState<[string, string, string]>(["0xd4949664cd82660aae99bedc034a0dea8a0bd517", "EVMOS", "Wrapped Evmos"]);
  const [tokenHourlyData, setTokenHourlyData] = useState<TokenHourData[]>([]);
  const [poolPair, setPoolPair] = useState<[string, string]>(["0xd4949664cd82660aae99bedc034a0dea8a0bd517", "0x2C68D1d6aB986Ff4640b51e1F14C716a076E44C4"]);
  const [tradeData, setTradeData] = useState<InterfaceTrade | null>(null);
  const [wevmosData, setWevmosData] = useState<any[]>([]);
  const [wevmosChange, setWevmosChange] = useState(0);
  // const tokenData = getCandles(poolAddr)
  // useEffect(() => {
  //   const tokenAddress = selectedToken?.isToken ? selectedToken.address : '0xd4949664cd82660aae99bedc034a0dea8a0bd517';
  //   setTokenAddr(tokenAddress)
  useEffect(() => {
    fetchPrice().then(priceData => {
      const lastPrice = priceData[23]?.[4];
      const firstPrice = priceData[0]?.[4];
      const percentageChange = ((firstPrice - lastPrice) / lastPrice) * 100;
      const wevmosDataObject = priceData.map((ohlcv: any) => ({
        periodStartUnix: ohlcv[0],
        open: ohlcv[1],
        high: ohlcv[2],
        low: ohlcv[3],
        close: ohlcv[4],
        volumeUSD: ohlcv[5],
      }));
      setWevmosData(wevmosDataObject);
      setWevmosChange(percentageChange)
      console.log(wevmosData)
    });
  }, []);
  useEffect(() => {
    setTradeQuote(inputToken.current);
  }, [inputToken.current]);

  useEffect(() => {
    getTokenHourly(tradeQuote[0], 180, tradeQuote[1])
      .then((data: { forge: { tokenHourDatas: TokenHourData[] } }) => {
        if (data.forge && data.forge.tokenHourDatas) {
          const tokenHourlyDataMap = data.forge.tokenHourDatas.map((item: TokenHourData) => ({
            periodStartUnix: item.periodStartUnix,
            datetime: new Date(item.periodStartUnix * 1000).toLocaleString(),
            open: item.open.toString(),
            high: item.high.toString(),
            low: item.low.toString(),
            close: Number(item.close),
            priceUSD: item.priceUSD.toString(),
            totalValueLockedUSD: item.totalValueLockedUSD.toString(),
            volumeUSD: item.volumeUSD.toString()
          }));
          setTokenHourlyData(tokenHourlyDataMap.reverse());
        } else {
          console.log(data)
          console.error('data.forge.tokenHourDatas is undefined');
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [inputToken.current]);

  useEffect(() => {
    if (tradeData?.routes[0].input) {
      const newTokenAddr = tradeData.routes[0].input.wrapped.address;
      if (newTokenAddr !== tokenAddr) {
        setTokenAddr(newTokenAddr);
      }
    }
  }, [tradeData]);
  // }, [selectedToken]);

  // useEffect(() => {
  //   const inputAsset = tradeQuote?.routes[0]?.input
  //   const inputAssetAddress = inputAsset?.isToken ? inputAsset.address : '0xd4949664cd82660aae99bedc034a0dea8a0bd517';
  //   const outputAsset = tradeQuote?.routes[0]?.output
  //   const outputAssetAddress = outputAsset?.isToken ? outputAsset.address : '0xd4949664cd82660aae99bedc034a0dea8a0bd517';
  //   setPoolPair([inputAssetAddress, outputAssetAddress])

  //   console.log(poolPair)
  // }, [tradeQuote]);

  //   useEffect(() => {
  //     getTopPools(tokenAddr).then(poolAddr => {
  //       getCandles(poolAddr)
  //     });
  //   }, [tokenAddr]);
  const debouncedChange = (inputToken: [string, string, string]) => {
    console.log('debounced called');
    setTradeQuote([inputToken[0], inputToken[1], inputToken[2]]);

  };


  const valueFormatter = function (number: number) {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
  };

  const theme: Theme = {
    networkDefaultShadow: "hsla(328, 97%, 53%, 0.02)",
    borderRadius: {
      xsmall: 0,
      small: 0.2,
      medium: 0.3,
      large: 0.4
    },
  }
  const jsonRpcUrlMap = {
    9001: ['https://lb.nodies.app/v1/2172c4701af3452b81bbd35609ab9a08'],
  }
  return (
    <div className="dark bg-[#1a1a1a]  text-gray-200 text-sm xl:text-md">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 text-xs bg-neutral-900">
          <Grid numItems={1} numItemsSm={1} numItemsLg={3} className="gap-8 p-6">
            <Col numColSpan={1} numColSpanLg={1} className="w-full">

              <Card className="h-36 pt-4 mb-6 bg-neutral-900">
                <Flex alignItems="start" justifyContent="between" className="px-4">
                <Title className="text-[1.1rem] font-semibold">{tradeQuote[1] || ''} <span className="text-sm font-normal font-mono tracking-tight">{tradeQuote[2] || ''}</span></Title>

                  <Title className="text-base inline-flex">
                    <span className="inline align-start vertical-top mr-2 font-mono">
                      {wevmosData[0] ? formatDollarAmount(Number(wevmosData[0].close), 4) : 0}
                    </span>
                    <BadgeDelta deltaType={wevmosChange > 0 ? "increase" : "decrease"} className="text-xs">
                      {wevmosChange.toFixed(2)}%
                    </BadgeDelta>
                  </Title>
                </Flex>
                <AreaChart
                  className="marketcharts mt-3 h-20 p-4"
                  data={tokenHourlyData} // Use the filtered data
                  index="datetime"
                  categories={["priceUSD"]}
                  colors={["orange"]}
                  // onValueChange={(trade) => setTradeData(trade)}
                  showXAxis={false}
                  showGridLines={false}
                  showYAxis={false}
                  showLegend={false}
                  showTooltip={true}
                  showGradient
                  showAnimation
                  autoMinValue
                  animationDuration={1800}
                  valueFormatter={valueFormatter}
                />

              </Card>
              <Card className="px-4 py-3 mb-6 bg-neutral-900 border-orange-500 border-2 hover:border-orange-600 ">
                <Link href="/earn">
                  <Flex alignItems="center" justifyContent="between">

                    <Title className="text-xs">Earn with incentives</Title>
                    <Title className="text-xs">*Up to 322% <span className="text-[0.6rem] inline">⧉</span></Title>

                  </Flex>
                </Link>
              </Card>
              <Card>
                <Suspense fallback={<p>Loading...</p>}>
                  <SwapWidget
                    defaultChainId={9001}
                    defaultInputTokenAddress="NATIVE"
                    defaultInputAmount={1}
                    defaultOutputTokenAddress="0x2c68d1d6ab986ff4640b51e1f14c716a076e44c4"
                    routerUrl={"https://forge-router.evmosdao.xyz/"}
                    brandedFooter={false}
                    width="100%"
                    theme={theme}

                    // onTokenChange = {useCallback((field: Field, token: Currency | null) => {
                    //   if (field === Field.INPUT && token) {
                    //     const tokenSymbol = token.symbol || '';
                    //     const tokenName = token.name || '';
                    //     inputToken.current = [token.wrapped.address, tokenSymbol, tokenName];
                    //   }
                    // }, [])}
                    onInitialSwapQuote={(trade) => {
                      console.log(trade)
                      inputToken.current = [trade.routes[0].input.wrapped.address, trade.routes[0].input.symbol || '', trade.routes[0].input.name || ''];
                      console.log('inputToken.current:', inputToken.current);
                    }}
                    // {
                    //   const tokenSymbol = tradeData.symbol || '';
                    //   const tokenName = token.name || '';
                    //   inputToken.current = [token.wrapped.address, tokenSymbol, tokenName];
                    // }

                    jsonRpcUrlMap={jsonRpcUrlMap}
                    className="dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card"
                  // {...eventHandlers}
                  />
                </Suspense>
              </Card>

            </Col>
            <Col numColSpan={2} numColSpanLg={2}>
              <DayOverview />
              <Col numColSpan={2}>
                <Card className="bg-neutral-900 py-8 px-8 rounded-sm min-h-[70vh] h-[80vh]">
                  {/* <Suspense fallback={<p>Loading...</p>}>
                <Iframe url="https://explorer.forge.trade/tokens"/>
                </Suspense> */}
                  <Suspense fallback={<p>Loading...</p>}>
                    <Iframe url="https://forge-viz.vercel.app/tokens" />
                    {/* <Iframe url="https://explorer.forge.trade/pools" /> */}
                  </Suspense>
                </Card>
              </Col>
            </Col>

          </Grid>

        </main>
      </div>
    </div>
  )
}

