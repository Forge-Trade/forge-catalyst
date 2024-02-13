import React, { ReactNode, ReactElement } from 'react';

import { Badge } from "@/components/ui/badge"
import { CardContent, Card, CardHeader, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import shortenENS, { formatDollarAmount, formatAmount, formatTime } from "@/lib/helpers"
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from "@tremor/react";
import { gql } from '../../grafbase'
import { Header } from "@/components/header"
import { HandIcon } from "@heroicons/react/outline";
import { TwitterIcon, GlobeIcon, GithubIcon, AtSignIcon, UserIcon } from 'lucide-react';
import {
    Col,
    Grid,
    Flex,
    Text,
    ProgressBar,
    Metric,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@tremor/react";
import Link from 'next/link';
import ConstructionAlert from '@/components/construction';
import Image from 'next/image';


export default async function ProfilePage({ params }: { params: { address: string } }) {
    const queryFields = "_id duration size sizeUsd margin marginUsd entryPrice closePrice leverage productId fee feeUsd pnl pnlUsd wasLiquidated isLong isFullClose timestamp";
    const query = `{arkiver2 { Trades (sort: TIMESTAMP_DESC limit:100 filter: {user: "${params.address}" chainId: 9001}){ ${queryFields} }}}`
    const data = await gql(query)

    return (
        <div key="1" className="dark bg-[#1a1a1a] h-screen text-gray-200 text-sm xl:text-md">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 text-xs bg-neutral-900">
                    <Header breadcrumbs={["Profile", params.address]} />


                    <section>
                        <Card className="bg-background shadow-md rounded-lg py-4 px-1 h-min overflow-y-hidden">
                            <CardContent>
                                <TabGroup className="">
                                    <TabList variant="solid" className="font-mono my-4">
                                        <Tab>Trade History (Last 100)</Tab>
                                    </TabList>
                                    <TabPanels className="px-0">
                                        <TabPanel>

                                            <Table>
                                                <TableHead>
                                                    <TableRow className="mb-4">
                                                        <TableHeaderCell className="text-gray-200 w-16">Market</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">Leverage x Margin</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">Margin <span className="font-mono text-xs">(USD)</span></TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">Size</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">PNL</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">Entry (Exit)</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">Fees</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">⌛</TableHeaderCell>
                                                        <TableHeaderCell className="text-gray-200">Timestamp</TableHeaderCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.arkiver2.Trades.map((trade: any, index: number) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-mono font-bold text-sm tracking-tighter">{trade.productId}</TableCell>
                                                            <TableCell className="text-xs tracking-tighter">
                                                                <span className={trade.isLong ? 'font-bold font-mono text-green-500 text-base' : 'font-bold font-mono text-red-500 text-base'}>
                                                                    {formatAmount(trade.leverage, 0)}
                                                                </span> x <span className="font-mono font-bold text-base ">
                                                                    {formatAmount(trade.margin, 0)}</span> <span className="font-sans text-[0.75rem] text-neutral-400">stEVMOS</span>
                                                            </TableCell>
                                                            <TableCell className="font-mono font-bold text-sm tracking-tighter">{formatDollarAmount(trade.marginUsd)}</TableCell>
                                                            <TableCell className="font-mono font-bold text-sm tracking-tighter">{formatDollarAmount(trade.sizeUsd)}  <span className="font-sans text-[0.75rem] text-neutral-400">({formatAmount(trade.size, 1)} <Image src="/stevmos.png" width={14} height={14} alt="stEVMOS" className="inline ml-1" />)</span></TableCell>
                                                            <TableCell className={`text-sm font-mono tracking-tighter font-medium ${trade.pnlUsd < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatDollarAmount(trade.pnlUsd)}  <span className="font-sans text-[0.75rem] text-neutral-400">({formatAmount(trade.pnl)} <Image src="/stevmos.png" width={14} height={14} alt="stEVMOS" className="inline ml-1" />)</span></TableCell>
                                                            <TableCell className="font-mono text-sm tracking-tighter">
                                                                ${Number(trade.entryPrice).toPrecision(6)} 
                                                                <span className={trade.closePrice - trade.entryPrice > 0 ? 'ml-1 text-green-500' : 'ml-1 text-red-500'}>
                                                                    ({formatDollarAmount(trade.closePrice - trade.entryPrice)})
                                                                </span>
                                                            </TableCell>

                                                            <TableCell className="font-mono text-xs tracking-tighter">
                                                                {trade.wasLiquidated ? 
                                                                    <span className="text-yellow-500">LIQUIDATED</span> :
                                                                    <>
                                                                        {formatAmount(trade.fee)} <Image src="/stevmos.png" width={16} height={16} alt="stEVMOS" className="inline" />
                                                                    </>
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs">{formatTime(trade.duration)}</TableCell>

                                                            <TableCell className="font-mono tracking-tighter text-xs">
                                                                {new Date(trade.timestamp * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, day: 'numeric', month: 'numeric', year: '2-digit' })}
                                                                {trade.isFullClose ? <span className="inline-flex self-center ml-2 text-neutral-400"><IconFullscreenExit /></span> : ''}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TabPanel>
                                    </TabPanels>
                                </TabGroup>
                            </CardContent>
                        </Card>
                    </section>


                </main>
            </div>
        </div>
    )
}

function IconFullscreenExit(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
        {...props}
      >
        <path d="M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z" />
      </svg>
    );
  }

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}

function TestIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <HandIcon />
    )
}
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}


function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    )
}


function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1em"
            width="1em"
            className="w-5 h-5"
            {...props}
        >
            <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
        </svg>
    );
}

function RedditIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1rem"
            width="1rem"
            className="w-5 h-5"

            {...props}
        >
            <path d="M288 568a56 56 0 10112 0 56 56 0 10-112 0zm338.7 119.7c-23.1 18.2-68.9 37.8-114.7 37.8s-91.6-19.6-114.7-37.8c-14.4-11.3-35.3-8.9-46.7 5.5s-8.9 35.3 5.5 46.7C396.3 771.6 457.5 792 512 792s115.7-20.4 155.9-52.1a33.25 33.25 0 10-41.2-52.2zM960 456c0-61.9-50.1-112-112-112-42.1 0-78.7 23.2-97.9 57.6-57.6-31.5-127.7-51.8-204.1-56.5L612.9 195l127.9 36.9c11.5 32.6 42.6 56.1 79.2 56.1 46.4 0 84-37.6 84-84s-37.6-84-84-84c-32 0-59.8 17.9-74 44.2L603.5 123a33.2 33.2 0 00-39.6 18.4l-90.8 203.9c-74.5 5.2-142.9 25.4-199.2 56.2A111.94 111.94 0 00176 344c-61.9 0-112 50.1-112 112 0 45.8 27.5 85.1 66.8 102.5-7.1 21-10.8 43-10.8 65.5 0 154.6 175.5 280 392 280s392-125.4 392-280c0-22.6-3.8-44.5-10.8-65.5C932.5 541.1 960 501.8 960 456zM820 172.5a31.5 31.5 0 110 63 31.5 31.5 0 010-63zM120 456c0-30.9 25.1-56 56-56a56 56 0 0150.6 32.1c-29.3 22.2-53.5 47.8-71.5 75.9a56.23 56.23 0 01-35.1-52zm392 381.5c-179.8 0-325.5-95.6-325.5-213.5S332.2 410.5 512 410.5 837.5 506.1 837.5 624 691.8 837.5 512 837.5zM868.8 508c-17.9-28.1-42.2-53.7-71.5-75.9 9-18.9 28.3-32.1 50.6-32.1 30.9 0 56 25.1 56 56 .1 23.5-14.5 43.7-35.1 52zM624 568a56 56 0 10112 0 56 56 0 10-112 0z" />
        </svg>
    );
}
function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
        </svg>
    )
}


function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            height="1em"
            width="1em"
            className="w-5 h-5"

            {...props}
        >
            <path d="M464 66.52A50 50 0 00414.12 17L97.64 16A49.65 49.65 0 0048 65.52V392c0 27.3 22.28 48 49.64 48H368l-13-44 109 100zM324.65 329.81s-8.72-10.39-16-19.32C340.39 301.55 352.5 282 352.5 282a139 139 0 01-27.85 14.25 173.31 173.31 0 01-35.11 10.39 170.05 170.05 0 01-62.72-.24 184.45 184.45 0 01-35.59-10.4 141.46 141.46 0 01-17.68-8.21c-.73-.48-1.45-.72-2.18-1.21-.49-.24-.73-.48-1-.48-4.36-2.42-6.78-4.11-6.78-4.11s11.62 19.09 42.38 28.26c-7.27 9.18-16.23 19.81-16.23 19.81-53.51-1.69-73.85-36.47-73.85-36.47 0-77.06 34.87-139.62 34.87-139.62 34.87-25.85 67.8-25.12 67.8-25.12l2.42 2.9c-43.59 12.32-63.44 31.4-63.44 31.4s5.32-2.9 14.28-6.77c25.91-11.35 46.5-14.25 55-15.21a24 24 0 014.12-.49 205.62 205.62 0 0148.91-.48 201.62 201.62 0 0172.89 22.95s-19.13-18.15-60.3-30.45l3.39-3.86s33.17-.73 67.81 25.16c0 0 34.87 62.56 34.87 139.62 0-.28-20.35 34.5-73.86 36.19z" />
            <path d="M212.05 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.8 0 24.7-11.83 24.7-26.57.25-14.76-10.9-26.57-24.7-26.57zM300.43 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.81 0 24.7-11.83 24.7-26.57S314 218 300.43 218z" />
        </svg>
    );
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


function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    )
}


function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    )
}


function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}

function TwitterIcon2(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
    )
}