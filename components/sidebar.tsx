/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'

import { Changelog } from '@/components/changelog';
import Trollbox from '@/components/trollbox';
import CountdownComponent from '@/components/countdown';
import { Separator } from './ui/separator';


export function Sidebar() {
    const pathname = usePathname()


    return (
        <>
            <aside id="sideMain" className="hidden bg-background px-4 h-screen lg:overflow-y-hidden lg:block lg:w-64 xl:flex-none">
                <div className="fixed flex justify-start py-6 w-full">
                    <Link href="/">
                        <Image
                            alt="Logo"
                            height="32"
                            width="128"
                            src="/forge-logo-small.png"
                        />
                    </Link>
                </div>
                <nav className="fixed mt-16 w-max  xl:scale-90 origin-top-left">
                <div className="mt-6">
                        <div className="mb-4 px-2">
                            <span className="text-gray-400 uppercase text-sm font-mono">Forge DeFi</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/swap' ? 'active' : ''}`} href="/swap" prefetch={false}>

                                    <SwapIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Swap Assets</span>
                                </Link>
                            </li>
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/bridge' ? 'active' : ''}`} href="/bridge" prefetch={false}>

                                    <BridgeIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Bridge Assets</span>
                                </Link>
                            </li>
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/earn' ? 'active' : ''}`} href="/earn" prefetch={false}>

                                    <IconPigMoney className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Earn <Badge className="ml-2" variant="secondary">
                                            Up to 233% 🔥
                                        </Badge>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-6">
                        <div className="mb-4 px-2">
                            <span className="text-gray-400 uppercase text-sm font-mono">Perpetual Futures</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/markets/overview' ? 'active' : ''}`} href="/markets/overview" prefetch>

                                    <MarketActivityIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Overview</span>
                                </Link>
                            </li>
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/markets/data' ? 'active' : ''}`} href="/markets/data">

                                    <TargetIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Market Data</span>
                                </Link>
                            </li>
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/pools' ? 'active' : ''}`} href="/pools">

                                    <FishIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">
                                        Liquidity Pools
                                        <Badge className="ml-2" variant="secondary">
                                            Earn ⚡
                                        </Badge>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-6">
                        <div className="mb-4 px-2">
                            <span className="text-gray-400 uppercase text-sm font-mono">Catalyst Trading Incentives</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                            <li className="sidebarlink flex flex-row items-center gap-2">
                                <Link className={`link ${pathname === '/leaderboard' ? 'active' : ''}`} href="/leaderboard" prefetch>

                                    <RulerIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Leaderboard</span>
                                </Link>
                            </li>
                            <li className="sidebarlink flex items-center gap-2">
                                <Link className={`link ${pathname === '/faq' ? 'active' : ''}`} href="/faq">

                                    <SettingsIcon className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-200">Rules / FAQ</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                  
                    
                </nav>
                <div className="sidebarlink w-52 ml-2 xl:ml-1">
                        <Card className="w-52 mt-8 bg-neutral-900 fixed place-self-end bottom-16">
                            <CardHeader className="xl:pb-4 xl:mx-auto">
                                <CardDescription className="text-xs font-mono text-center">NEXT <span className="font-bold tracking-wider text-neutral-300">CATALYST</span> PHASE IN</CardDescription>
                            </CardHeader>
                            <Separator className="my-2"/>
                            <CardContent className="grid grid-cols-1 gap-2 items-center text-center xl:scale-75 xl:px-0 xl:mx-auto">
                                <CountdownComponent />
                            </CardContent>
                        </Card>
                    </div>
                <div className="sidebarlink fixed bottom-4 origin-bottom-left">
                    <Sheet>

                        <SheetTrigger asChild>
                            <div>
                                <Button variant="link" className="link font-mono uppercase text-xs px-2 py-1">Deployment ID: 420b44y6</Button>
                                <span className="flex inline-flex h-2 w-2 top-1.5 right-1 -mr-1">
                                    <span className="animate-ping duration-700 absolute inline-flex h-2 w-2 rounded-full bg-orange-9000 opacity-25"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 opacity-75 bg-orange-500"></span>
                                </span>
                            </div>
                        </SheetTrigger>
                        <SheetContent className="p-0" side="right">
                            <Changelog />
                        </SheetContent>

                    </Sheet>


                </div>

            </aside>
        </>
    )
}

function SwapIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="20"
        width="20"
        {...props}
      >
        <path d="M21 9l-4-4v3h-7v2h7v3M7 11l-4 4 4 4v-3h7v-2H7v-3z" />
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

function TrollBoxIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>

    )
}


function IconPigMoney(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        {...props}
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M15 11v.01M5.173 8.378a3 3 0 114.656-1.377" />
        <path d="M16 4v3.803A6.019 6.019 0 0118.658 11h1.341a1 1 0 011 1v2a1 1 0 01-1 1h-1.342c-.336.95-.907 1.8-1.658 2.473V19.5a1.5 1.5 0 01-3 0v-.583a6.04 6.04 0 01-1 .083h-4a6.04 6.04 0 01-1-.083v.583a1.5 1.5 0 01-3 0v-2L5 17.473A6 6 0 018.999 7h2.5l4.5-3H16z" />
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

function BridgeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="20"
        width="20"
        {...props}
      >
        <path d="M7 14v-3.09c-.72-.33-1.39-.73-2-1.2V14h2m-2 4H3v-2H1v-2h2V7h2v1.43C6.8 10 9.27 11 12 11c2.73 0 5.2-1 7-2.57V7h2v7h2v2h-2v2h-2v-2H5v2m12-7.09V14h2V9.71c-.61.47-1.28.87-2 1.2M16 14v-2.68c-.64.23-1.31.4-2 .52V14h2m-3 0v-2.04L12 12l-1-.04V14h2m-3 0v-2.16c-.69-.12-1.36-.29-2-.52V14h2z" />
      </svg>
    );
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


function MarketActivityIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
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
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20px" height="20px">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
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
function ToolsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20"
            height="20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>

    )
}
