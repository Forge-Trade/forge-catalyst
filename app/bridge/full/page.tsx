"use client"
import { Sidebar } from "@/components/sidebar"
import { Grid, Col, Text, Metric } from "@tremor/react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Teaser } from "@/components/teaser"
import shortenENS, { formatDollarAmount, formatAmount } from "@/lib/helpers"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Header } from "@/components/header"
import WormholeBridge from '@wormhole-foundation/wormhole-connect';
import { CardContent, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { List, ListItem, Title } from "@tremor/react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";



const chains = [
    {
        chain: "BSC",
        assets: "BNB BUSD ETH USDC WBNB WETH ",
    },
    {
        chain: "polygon",
        assets: "ETH MATIC USDC USDT WMATIC WETH WBTC tBTC",
    },
    {
        chain: "avalanche",
        assets: "AVAX DAI ETH USDC USDT WAVAX WBTC WETH",
    },
    {
        chain: "fantom",
        assets: "DAI ETH FTM USDC USDT WBTC WETH",
    },
    {
        chain: "celo",
        assets: "CELO DAI ETH USDT WBTC WETH",
    },
    {
        chain: "moonbeam",
        assets: "DAI ETH GLMR USDC USDT WETH WGLMR",
    },
    {
        chain: "arbitrum",
        assets: "ETH USDC WETH WBTC WETH tBTC",
    },
    {
        chain: "optimism",
        assets: "ETH USDC USDT WBTC WETH tBTC wstETH",
    },
    {
        chain: "base",
        assets: "ETH USDC USDT WBTC WETH WETH tBTC wstETH",
    },
    {
        chain: "... and more",
        assets: "",
    }
];

export default function Bridge() {
    // const query = `{ arkiver { Products(filter: {chainId: 9001}, sort: TRADECOUNT_DESC){ _id openInterestLongUsd openInterestShortUsd cumulativeFeesUsd cumulativePnlUsd cumulativeMarginUsd cumulativeVolumeUsd cumulativeLiquidationsUsd positionCount tradeCount } } }`
    // const data = await gql(query)

    // console.log(aggregatedData)
    return (
        <div key="1" className="dark bg-[#1a1a1a] h-screen overflow-y-hidden text-gray-200 text-sm xl:text-md">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 text-xs bg-neutral-900 h-screen">
                    <Grid numItems={1} numItemsSm={1} numItemsLg={2} className="gap-4 p-6">
                        <Col numColSpan={1} numColSpanLg={1} className="lg:scale-[0.9] lg:origin-top-left xl:scale-100">
                            <WormholeBridge
                                config={{
                                    "env": "mainnet", "cta": { "text": "Swap Assets on Forge", "link": "https://app.forge.trade" }, "walletConnectProjectId": "c5220802fbb362d942d7ef3813ed29c2",
                                    "partnerLogo": "https://wnr1c6qx6jcz9qde.public.blob.vercel-storage.com/data/forge-logo-small%20(1).png",
                                    "tokens": ["APT", "AVAX", "BNB", "BONK", "BUSD", "CELO", "DAI", "ETH", "ETHarbitrum", "ETHbase", "ETHoptimism", "EVMOS", "FTM", "GLMR", "KUJI", "MATIC", "OSMO", "PYTH", "SOL", "SUI", "USDCarbitrum", "USDCavax", "USDCbase", "USDCbnb", "USDCeth", "USDCoptimism", "USDCpolygon", "USDCsol", "USDT", "WAVAX", "WBNB", "WBTC", "WETH", "WETHarbitrum", "WETHbase", "WETHbsc", "WETHoptimism", "WETHpolygon", "WFTM", "WGLMR", "WMATIC", "WSOL", "tBTC", "tBTCarbitrum", "tBTCbase", "tBTCoptimism", "tBTCpolygon", "tBTCsol", "wstETH", "wstETHbase", "wstETHoptimism", "wstETHpolygon"],
                                    "customTheme": {
                                        "primary": {
                                            "50": "#fafafa",
                                            "100": "#f5f5f5",
                                            "200": "#eeeeee",
                                            "300": "#e0e0e0",
                                            "400": "#bdbdbd",
                                            "500": "#9e9e9e",
                                            "600": "#757575",
                                            "700": "#616161",
                                            "800": "#424242",
                                            "900": "#212121",
                                            "A100": "#f5f5f5",
                                            "A200": "#eeeeee",
                                            "A400": "#bdbdbd",
                                            "A700": "#616161"
                                        },
                                        "secondary": {
                                            "50": "#fafafa",
                                            "100": "#f5f5f5",
                                            "200": "#eeeeee",
                                            "300": "#e0e0e0",
                                            "400": "#bdbdbd",
                                            "500": "#9e9e9e",
                                            "600": "#757575",
                                            "700": "#616161",
                                            "800": "#424242",
                                            "900": "#212121",
                                            "A100": "#f5f5f5",
                                            "A200": "#eeeeee",
                                            "A400": "#bdbdbd",
                                            "A700": "#616161"
                                        },
                                        "divider": "#ffffff33",
                                        "background": {
                                            "default": "transparent"
                                        },
                                        "text": {
                                            "primary": "#ffffff",
                                            "secondary": "#9e9e9e"
                                        },
                                        "error": {
                                            "50": "#ffebee",
                                            "100": "#ffcdd2",
                                            "200": "#ef9a9a",
                                            "300": "#e57373",
                                            "400": "#ef5350",
                                            "500": "#f44336",
                                            "600": "#e53935",
                                            "700": "#d32f2f",
                                            "800": "#c62828",
                                            "900": "#b71c1c",
                                            "A100": "#ff8a80",
                                            "A200": "#ff5252",
                                            "A400": "#ff1744",
                                            "A700": "#d50000"
                                        },
                                        "info": {
                                            "50": "#97a5b7",
                                            "100": "#8293a9",
                                            "200": "#6e819a",
                                            "300": "#596f8c",
                                            "400": "#445d7e",
                                            "500": "#e14a34",
                                            "600": "#2b4464",
                                            "700": "#263c59",
                                            "800": "#21354e",
                                            "900": "#1c2d43",
                                            "A100": "#e14a34",
                                            "A200": "#e14a34",
                                            "A400": "#e14a34",
                                            "A700": "#e14a34"
                                        },
                                        "success": {
                                            "50": "#66d6cd",
                                            "100": "#4dcfc4",
                                            "200": "#33c8bc",
                                            "300": "#1ac1b4",
                                            "400": "#01BBAC",
                                            "500": "#00a89a",
                                            "600": "#009589",
                                            "700": "#008278",
                                            "800": "#007067",
                                            "900": "#005d56",
                                            "A100": "#00a89a",
                                            "A200": "#00a89a",
                                            "A400": "#00a89a",
                                            "A700": "#00a89a"
                                        },
                                        "warning": {
                                            "50": "#ffe3a4",
                                            "100": "#ffdd91",
                                            "200": "#ffd77f",
                                            "300": "#ffd26d",
                                            "400": "#ffcc5b",
                                            "500": "#FFC749",
                                            "600": "#e5b341",
                                            "700": "#cc9f3a",
                                            "800": "#b28b33",
                                            "900": "#99772b",
                                            "A100": "#FFC749",
                                            "A200": "#FFC749",
                                            "A400": "#FFC749",
                                            "A700": "#FFC749"
                                        },
                                        "button": {
                                            "primary": "#ffffff19",
                                            "primaryText": "#ffffff",
                                            "disabled": "#ffffff0F",
                                            "disabledText": "#ffffff66",
                                            "action": "#ffffff",
                                            "actionText": "#000000",
                                            "hover": "#1212120F"
                                        },
                                        "options": {
                                            "hover": "#ffffff0F",
                                            "select": "#ffffff19"
                                        },
                                        "card": {
                                            "background": "#ffffff0C",
                                            "secondary": "#ffffff0C",
                                            "elevation": "none"
                                        },
                                        "popover": {
                                            "background": "#1a1a1a",
                                            "secondary": "#ffffff0C",
                                            "elevation": "none"
                                        },
                                        "modal": {
                                            "background": "#0d0e0e"
                                        },
                                        "font": {
                                            "primary": "\"Inter\", sans-serif",
                                            "header": "\"IBM Plex Mono\", monospace"
                                        }
                                    },
                                    "bridgeDefaults": {
                                        "toNetwork": "evmos",
                                        "requiredNetwork": "evmos"
                                    },
                                    "showHamburgerMenu": false,
                                    "menu": [
                                        {
                                            "label": "(Alternative Bridge) Layerswap",
                                            "href": "https://layerswap.io/app",
                                            "target": "_blank",
                                            "order": 0
                                        }
                                    ],
                                    "explorer":
                                    {
                                        "label": "Escan ↗",
                                        "href": "https://escan.live/{address}"
                                    }

                                }}
                            />
                        </Col>
                        <Col className="mt-5">
                            <Card className="bg-neutral-800 p-3 pt-5">
                                <CardHeader>
                                    <CardTitle>🛑 Warning: Advanced Users Only</CardTitle>
                                    <CardDescription>If you are not confident in what you are bridging or are confused about anything, we highly recommend that you hit that back button and use the controlled bridge.</CardDescription>
                                </CardHeader>
                                <Separator className="bg-neutral-700 mb-4 w-[95%] mx-auto" />
                                <CardContent className="leading-6">
                                    <p className="mb-3">As much as we are excited about the full integration of Wormhole on Evmos, we felt the need to disable all networks and unsupported assets to save you a big headache.</p>
                                    <p className="mb-3">Before we can fully utilize the bridge and all the EVM goodies it bring, we must create the ERC20 representation of the tokens.</p>
                                    <Separator className="bg-neutral-700 my-4 mx-auto" />
                                    <Title className="mb-6">ERC20 registration for assets that came from EVMs? That sounds very unintuitive.</Title>
                                    We know. We were all scratching our heads about this - but goddamn it, we finally have a decent bridge into Evmos, and we&apos;ll take that as a huge win. While our search for a true EVM-to-EVM bridge continues, Wormhole has blessed us for the time being.
                                </CardContent>
                                <Separator className="my-4" />
                                <CardFooter><Link href="/bridge"><Button variant="link"><span className="animate-pulse mr-2">&larr;</span> Take me back to the controlled bridge.</Button></Link></CardFooter>
                            </Card>
                        </Col>
                    </Grid>

                </main>
            </div>
        </div>
    )
}

