import React from 'react';
import { Suspense } from 'react';

import { CardContent, Card, CardHeader, CardFooter } from "@/components/ui/card"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Leaderboard } from "@/components/leaderboard"
import { revalidateTag } from 'next/cache'
import { gql } from '../grafbase'
import Link from 'next/link';
import Review from "./review"

export const runtime = 'edge' // 'nodejs' (default) | 'edge'
async function getName(address: string) {
  try {
    const res = await fetch(`https://api.evmos.domains/${address}`, { next: { revalidate: 3600 } })
    const data = await res.json();

    // If there's an error field in the response, return the address
    if (data.error) {
      return "";
    }

    // Otherwise, return the name
    return data.name;
  } catch (error) {
    // If there's an error in the fetch operation, return the address
    return "";
  }
}
async function getAvatar(name: string) {
  try {
    const res = await fetch(`https://api.evmos.domains/${name}`, { next: { revalidate: 3600 } })
    const data = await res.json();

    // If there's an error field in the response, return the address
    if (data.error) {
      return "";
    }

    // Otherwise, return the name
    return data.avatar;
  } catch (error) {
    // If there's an error in the fetch operation, return the address
    return "";
  }
}
async function getCachedTrades() {
  //const res = await fetch('https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/data/cachedTrades.blank.json')
  // const res = {"Trades":[{}]}
  //if (!res.ok) {
    // throw new Error('Failed to fetch data')
  console.log('temp fix')
  return {"Trades":[{}]}
}

export default async function Home() {
  // const cachedTrades = await getCachedTrades()

  const query = `{ arkiver2 { Trades ( filter: { _operators: {timestamp:{gte: 1706745600 }}, chainId: 9001} sort: TIMESTAMP_DESC limit: 1000 ) { _id timestamp user productId margin marginUsd leverage size sizeUsd feeUsd pnl pnlUsd  wasLiquidated duration}}}`
  const data = await gql(query)
  const skipUsers = ['0xc0f316E58DBB0A203b5B5808adc51a8D39abCdA0', 'xx51c47a2f7d38cc175b53c8cccb64ad526d057eed', 'user_address3'];
  // console.log(data)
  // const mergedData = [...data?.arkiver2?.Trades, ...cachedTrades?.Trades];
  const mergedData = [...data?.arkiver2?.Trades];
  // console.log(mergedData)

  const filteredData = mergedData.filter((trade: any) => !skipUsers.map(user => user.toLowerCase()).includes(trade.user.toLowerCase()));

  const totalVolume = filteredData?.reduce((total: any, trade: any) => total + trade.size, 0);
  const aggregatedData = filteredData?.reduce((acc: { [key: string]: any }, trade: any) => {
    // If the user key doesn't exist in the accumulator, create it with an empty array

    if (!acc[trade.user]) {
      acc[trade.user] = { pnl: 0, pnlUsd: 0, size: 0, margin: 0, marginUsd: 0, sizeUsd: 0, duration: 0, feeUsd: 0, trades: [], tradeCount: 0, wins: 0, losses: 0, liqCount: 0, volumePercentage: 0, nickname: "", avatar: "" };
    }
    acc[trade.user].pnl += trade.pnl;
    acc[trade.user].pnlUsd += trade.pnlUsd;
    acc[trade.user].size += trade.size;
    acc[trade.user].sizeUsd += trade.sizeUsd;
    acc[trade.user].marginUsd += trade.marginUsd;
    // Check duration and timestamp and only add if they are not the same
    if (trade.duration !== trade.timestamp) {
      acc[trade.user].duration += trade.duration;
    }
    if (!trade.wasLiquidated) {
      acc[trade.user].feeUsd += trade.feeUsd;
      acc[trade.user].margin += trade.margin;
    }
    if (trade.wasLiquidated) {
      acc[trade.user].liqCount += 1;
    }
    acc[trade.user].tradeCount += 1;

    // Increment wins or losses based on pnl
    if (trade.pnl > 0) {
      acc[trade.user].wins += 1;
    } else if (trade.pnl < 0 && !trade.wasLiquidated) {
      acc[trade.user].losses += 1;
    }
    // Push the trade into the user's array
    acc[trade.user].trades.push(trade);
    acc[trade.user].volumePercentage = (acc[trade.user].size / totalVolume);

    return acc;
  }, {});
  for (let user in aggregatedData) {
    aggregatedData[user].avgSizeUsd = aggregatedData[user].sizeUsd / aggregatedData[user].tradeCount;
    aggregatedData[user].avgDuration = (aggregatedData[user].duration / aggregatedData[user].tradeCount) / 60;
    aggregatedData[user].winLossRatio = aggregatedData[user].losses > 0 ? aggregatedData[user].wins / aggregatedData[user].losses : 'N/A';

  }

  const uniqueUsers = Object.keys(aggregatedData);
  const promises = uniqueUsers.map(user => getName(user));
  const usersData = await Promise.all(promises);

  // Update the "nickname" field for each user in aggregatedData
  usersData.forEach(async (name, index) => {
    const user = uniqueUsers[index];
    aggregatedData[user].nickname = name;
  });
  // Fetch all avatars at once
  const avatarPromises = usersData.map(name => getAvatar(name));
  const avatarsData = await Promise.all(avatarPromises);

  // Update the "avatar" field for each user in aggregatedData
  avatarsData.forEach((avatar, index) => {
    const user = uniqueUsers[index];
    aggregatedData[user].avatar = avatar;
  });
  return (
    <div key="1" className="dark bg-[#1a1a1a] h-full overflow-x-hidden	 lg:h-screen text-gray-200 text-sm xl:text-md">
      <div className="flex flex-row max-w-screen lg:max-h-screen">
        <Sidebar />


        <main className="flex-auto max-w-[100vw] overflow-x-hidden  text-xs bg-background-secondary lg:flex-shrink lg:shrink lg:p-4 lg:max-w-full">
          {/* <Header /> */}
          <ScrollArea className="h-full px-2 w-full overflow-x-hidden lg:w-auto lg:overflow-x-none lg:h-calcscreen lg:px-2 lg:pr-4">

            <section className="container px-1">
              <h2 className="text-xl font-bold mb-4 text-gray-100 self-center px-2 py-4 lg:text-2xl">
                Catalyst Leaderboard
                <span className="hidden lg:inline align-middle items-center ml-4 self-center bg-[#e04a33] text-sm text-white px-2 py-1 rounded-md">
                  ROUND: 2
                </span>
              </h2>
              <div className="flex justify-between mb-4 overflow-x-hidden ">
                <Tabs className="flex flex-col justify-between max-w-screen" defaultValue="pnl" orientation="vertical">
                  <TabsList className="block w-max text-xs lg:flex lg:w-full lg:justify-start gap-4">
                    <span className="hidden lg:block text-gray-100 font-bold pl-4 mr-4">Leaderboard View</span>
                    <TabsTrigger value="pnl" className="text-xs data-[state=active]:bg-neutral-800 lg:text-sm">
                      <LineChartIcon className="w-4 h-4 mr-2" />
                      PNL <Badge variant="outline" className="ml-2 rounded-sm border-green-600">Rewards</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="volume" className="text-xs data-[state=active]:bg-neutral-800 lg:text-sm">
                      <BarChartIcon className="w-4 h-4 mr-2" />
                      Volume (Phase 1)
                    </TabsTrigger>
                    {/* <TabsTrigger value="liq" className="hidden text-xs data-[state=active]:bg-neutral-800 lg:flex lg:text-sm">
                      <DropletsIcon className="w-4 h-4 mr-2" />
                      Liquidations
                    </TabsTrigger> */}
                  </TabsList>
                  <TabsContent value="pnl">
                    <Card
                      className="max-w-screen w-screen overflow-x-hidden p-4 lg:scale-100 bg-background shadow-md rounded-lg lg:p-1 lg:h-min lg:max-h-screen lg:pt-6 overflow-y-hidden lg:w-full"

                      style={{
                        scrollbarColor: "#888 #eee",
                        scrollbarWidth: "thin",
                      }}
                    >

                      <CardContent>
                        <Suspense fallback={<Loading />}>
                          <Leaderboard data={aggregatedData} sortKey="pnlUsd" />
                        </Suspense>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="volume">

                    <Card
                      className="max-w-screen w-screen overflow-x-hidden py-4 lg:scale-100 bg-background shadow-md rounded-lg lg:p-1 lg:h-min lg:max-h-screen lg:pt-6 overflow-y-hidden lg:w-full"
                      style={{
                        scrollbarColor: "#888 #eee",
                        scrollbarWidth: "thin",
                      }}
                    >

                      <CardContent>
                        <Suspense fallback={<Loading />}>
                          <Review />
                        </Suspense>

                      </CardContent>

                    </Card>
                  </TabsContent>

                  {/* <TabsContent value="liq">
                    <Card
                      className="bg-background shadow-md rounded-lg p-1 pt-6 h-min max-h-screen overflow-y-hidden w-full"
                      style={{
                        scrollbarColor: "#888 #eee",
                        scrollbarWidth: "thin",
                      }}
                    >

                      <CardContent>
                        <Suspense fallback={<Loading />}>
                          <Leaderboard data={aggregatedData} sortKey="liquidations" />
                        </Suspense>
                      </CardContent>
                      <CardFooter className="grid pt-2">
                        <Disclaimer />
                      </CardFooter>
                    </Card>
                  </TabsContent> */}
                </Tabs>

              </div>
            </section>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

        </main>


      </div>

    </div>
  )
}

function Loading() {
  return (<h2 className="animate-pulse">🌀 Loading...</h2>);
}

function Disclaimer() {
  return (
    <>

    </>
  )
}
function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}



function DropletsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  )
}


function FishIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
      <path d="M18 12v.5" />
      <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
      <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
      <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
      <path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
    </svg>
  )
}


function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}


function LineChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}


function RulerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </svg>
  )
}


function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}


function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}


function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}
